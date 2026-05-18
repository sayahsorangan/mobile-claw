import {useCallback, useState} from 'react';

import {initLlama} from 'llama.rn';

import {useAppDispatch, useAppSelector} from '@app/hooks/redux';
import {llm_action, LlmMessage} from '@redux-store/slice/llm';
import {memory_action} from '@redux-store/slice/memory';
import {store} from '@redux-store/store';

import {LlamaManager} from './';
import {buildPromptMessages} from './prompt-builder';
import {summarizeConversation} from './summarizer';
import {
  RECENT_MESSAGES_TO_KEEP,
  RECOMMENDED_CONTEXT_SIZE,
  RECOMMENDED_MAX_TOKENS,
  SUMMARIZE_MESSAGE_THRESHOLD,
} from './token-budget';
import {GenerateOptions, LoadModelOptions} from './types';

// ─── Background summarization ─────────────────────────────────────────────────

/**
 * Fire-and-forget: summarise old messages for a room, update the Memory slice,
 * then trim Redux messages to the most recent RECENT_MESSAGES_TO_KEEP.
 * Never throws — any failure is silently swallowed.
 */
async function triggerBackgroundSummarization(
  roomId: string,
  dispatch: ReturnType<typeof useAppDispatch>,
): Promise<void> {
  // Skip if another completion is already running (user sent a new message).
  // The count will be checked again on the next exchange.
  if (LlamaManager.isBusy()) return;

  const context = LlamaManager.getContext();
  if (!context) return;

  LlamaManager.setBusy(true);
  try {
    const state = store.getState();
    const allMessages = state.LlmReducer.messages;
    const existingSummary = state.MemoryReducer.summaries[roomId];

    // Only summarise messages older than what we keep recent
    const messagesToSummarise = allMessages.slice(0, -RECENT_MESSAGES_TO_KEEP);
    if (messagesToSummarise.length === 0) return;

    const summary = await summarizeConversation(
      context,
      messagesToSummarise.map(m => ({role: m.role, content: m.content})),
      existingSummary,
    );

    if (summary) {
      dispatch(memory_action.setSummary({roomId, summary}));
    }
    dispatch(memory_action.resetMessageCount(roomId));

    // Trim Redux in-memory messages to keep only the recent tail
    const recent = allMessages.slice(-RECENT_MESSAGES_TO_KEEP);
    dispatch(llm_action.setMessages(recent));
  } catch {
    // Summarisation is best-effort — never crash the chat
  } finally {
    LlamaManager.setBusy(false);
  }
}

// ─── useLoadModel ─────────────────────────────────────────────────────────────

export function useLoadModel() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const isModelLoaded = useAppSelector(state => state.LlmReducer.isModelLoaded);
  const modelPath = useAppSelector(state => state.LlmReducer.modelPath);

  const loadModel = useCallback(
    async (options: LoadModelOptions) => {
      try {
        setError(null);
        setProgress(0);
        dispatch(llm_action.setModelLoaded(false));

        await LlamaManager.release();

        const context = await initLlama(
          {
            model: options.modelPath,
            n_gpu_layers: options.nGpuLayers ?? 0,
            // 2048 fits our token budget (≤1700 prompt + 256 output) with headroom.
            // 4096 caused excessive memory pressure on low-end devices.
            n_ctx: options.contextSize ?? RECOMMENDED_CONTEXT_SIZE,
            // Disable context shifting — when ctx fills, return interrupted:true
            // instead of attempting a context shift which crashes on mobile.
            ctx_shift: false,
          },
          (pgrs: number) => setProgress(Math.round(pgrs)),
        );

        LlamaManager.setContext(context);
        dispatch(llm_action.setModelPath(options.modelPath));
        dispatch(llm_action.setModelLoaded(true));
        setProgress(100);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load model');
        dispatch(llm_action.setModelLoaded(false));
      }
    },
    [dispatch],
  );

  const unloadModel = useCallback(async () => {
    await LlamaManager.release();
    dispatch(llm_action.setModelLoaded(false));
    dispatch(llm_action.setModelPath(null));
    setProgress(0);
  }, [dispatch]);

  return {loadModel, unloadModel, isModelLoaded, modelPath, progress, error};
}

// ─── useChat ──────────────────────────────────────────────────────────────────

export function useChat() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(state => state.LlmReducer.messages);
  const isGenerating = useAppSelector(state => state.LlmReducer.isGenerating);
  const systemPrompt = useAppSelector(state => state.LlmReducer.systemPrompt);
  const language = useAppSelector(state => state.LlmReducer.language);
  const isModelLoaded = useAppSelector(state => state.LlmReducer.isModelLoaded);

  const sendMessage = useCallback(
    async (userText: string, options?: GenerateOptions) => {
      // Guard: prevent concurrent generations
      const currentState = store.getState().LlmReducer;
      if (currentState.isGenerating || !userText.trim()) {
        return;
      }

      const context = LlamaManager.getContext();
      if (!context) {
        return;
      }

      // Prevent concurrent context.completion() calls — llama.cpp is not thread-safe.
      // generateRoomTitle and any other fire-and-forget completions also check this flag.
      if (LlamaManager.isBusy()) {
        return;
      }

      LlamaManager.setBusy(true);
      const genId = Math.random().toString(36).slice(2);

      try {
        // ── Snapshot current state ───────────────────────────────────────────
        const stateSnapshot = store.getState();
        const llmState = stateSnapshot.LlmReducer;
        const memState = stateSnapshot.MemoryReducer;

        const basePrompt = llmState.systemPrompt || '';
        const userLang = llmState.language || 'auto';
        const allMessages = llmState.messages || [];

        // Per-room memory (Layer 2: summary, Layer 3: semantic memories)
        const roomId = options?.roomId;
        const conversationSummary = roomId ? memState.summaries[roomId] : undefined;
        const semanticMemories = memState.semanticMemories;

        // ── Create user message ──────────────────────────────────────────────
        const userMsg: LlmMessage = {
          id: `user_${Date.now()}_${genId}`,
          role: 'user',
          content: userText.trim(),
          createdAt: Date.now(),
        };
        dispatch(llm_action.addMessage(userMsg));

        // ── Create placeholder assistant message ─────────────────────────────
        const assistantMsg: LlmMessage = {
          id: `asst_${Date.now()}_${genId}`,
          role: 'assistant',
          content: '',
          createdAt: Date.now(),
        };
        dispatch(llm_action.addMessage(assistantMsg));
        dispatch(llm_action.setGenerating(true));

        // ── Resolve RAG chunks ────────────────────────────────────────────────
        // ragChunks option takes precedence over legacy llmPrompt
        let ragChunks: string[] | undefined = options?.ragChunks;
        if (!ragChunks && options?.llmPrompt) {
          // Backwards-compat: extract the text inside [INTERNAL KNOWLEDGE] block
          const match = options.llmPrompt.match(/\[INTERNAL KNOWLEDGE\]([\s\S]*?)\[\/INTERNAL KNOWLEDGE\]/);
          ragChunks = match?.[1] ? [match[1].trim()] : undefined;
        }

        // ── Build prompt with token budgets ───────────────────────────────────
        const promptMessages = buildPromptMessages({
          systemPrompt: basePrompt,
          language: userLang,
          conversationSummary,
          semanticMemories: semanticMemories.length ? semanticMemories : undefined,
          recentMessages: allMessages.map(m => ({role: m.role, content: m.content})),
          ragChunks,
          userMessage: userText.trim(),
        });
        // ── Stream generation ─────────────────────────────────────────────────
        // Batch Redux writes every 150 ms to reduce MMKV persistence pressure
        let tokenBuffer = '';
        let batchTimer: ReturnType<typeof setInterval> | null = null;
        const flushBuffer = () => {
          if (tokenBuffer) {
            dispatch(llm_action.appendToLastAssistantMessage(tokenBuffer));
            tokenBuffer = '';
          }
        };

        // Continuation loop ─────────────────────────────────────────────────
        // llama.rn returns stopped_limit > 0 when n_predict is exhausted before
        // the model emits an EOS or stop word, meaning the response is incomplete.
        // We re-invoke completion with the partial text as an assistant prefill
        // (the "assistant prefill" technique) so the model continues seamlessly.
        // We cap at MAX_CONTINUATIONS to prevent infinite loops.
        let fullAccumulatedText = '';
        let continuationCount = 0;
        const MAX_CONTINUATIONS = 3;
        let currentMessages: typeof promptMessages = promptMessages;

        for (;;) {
          batchTimer = setInterval(flushBuffer, 150);
          let completionResult: Awaited<ReturnType<typeof context.completion>> | undefined;
          try {
            completionResult = await context.completion(
              {
                messages: currentMessages,
                // Cap output at 256 tokens — unlimited generation crashes mobile
                n_predict: options?.maxTokens ?? RECOMMENDED_MAX_TOKENS,
                temperature: options?.temperature ?? 0.7,
                top_p: options?.topP ?? 0.9,
                // Disable thinking mode — thinking models (QwQ, DeepSeek-R1) generate
                // thousands of <think> tokens that overflow n_ctx and crash the app.
                enable_thinking: false,
                // Comprehensive stop words covering all common model families.
                // getFormattedChat() also auto-merges model-specific stops via Jinja.
                stop: [
                  '</s>',
                  '<|end|>',
                  '<|eot_id|>',
                  '<|end_of_text|>',
                  '<|im_end|>',
                  '<|EOT|>',
                  '<|END_OF_TURN_TOKEN|>',
                  '<|end_of_turn|>',
                  '<|endoftext|>',
                ],
              },
              data => {
                try {
                  if (data.token) {
                    fullAccumulatedText += data.token;
                    tokenBuffer += data.token;
                    options?.onToken?.(data.token);
                  }
                } catch {
                  // Ignore token callback errors
                }
              },
            );
          } finally {
            if (batchTimer) {
              clearInterval(batchTimer);
              batchTimer = null;
            }
            flushBuffer();
          }

          // stopped_limit > 0: model ran out of n_predict tokens before EOS.
          // Build continuation prompt with the full partial text as prefill.
          const hitLimit = (completionResult?.stopped_limit ?? 0) > 0;
          if (!hitLimit || continuationCount >= MAX_CONTINUATIONS) break;

          continuationCount++;
          // Rebuild from the original prompt every time to avoid stacking
          // duplicate assistant turns across iterations.
          currentMessages = [...promptMessages, {role: 'assistant' as const, content: fullAccumulatedText}];
        }

        // ── Post-generation: update message count + auto-summarise ────────────
        if (roomId) {
          dispatch(memory_action.incrementMessageCount(roomId));
          const newCount = store.getState().MemoryReducer.messagesSinceLastSummary[roomId] ?? 0;
          if (newCount >= SUMMARIZE_MESSAGE_THRESHOLD) {
            // Defer to after the finally block releases the busy lock.
            // Using setTimeout(0) ensures setBusy(false) has already run before
            // the summarization tries to acquire the context.
            setTimeout(() => triggerBackgroundSummarization(roomId, dispatch), 0);
          }
        }
      } catch (e: any) {
        LlamaManager.setBusy(false);
        const state = store.getState().LlmReducer;
        if (state.isGenerating && state.messages.length > 0) {
          const lastMsg = state.messages[state.messages.length - 1];
          if (lastMsg?.role === 'assistant') {
            dispatch(
              llm_action.appendToLastAssistantMessage('\n\n[Error: ' + (e?.message ?? 'Generation failed') + ']'),
            );
          }
        }
      } finally {
        LlamaManager.setBusy(false);
        dispatch(llm_action.setGenerating(false));
      }
    },
    [dispatch],
  );

  const clearChat = useCallback(() => {
    dispatch(llm_action.clearMessages());
  }, [dispatch]);

  const setLanguage = useCallback(
    (lang: string) => {
      dispatch(llm_action.setLanguage(lang));
    },
    [dispatch],
  );

  return {messages, isGenerating, isModelLoaded, systemPrompt, sendMessage, clearChat, language, setLanguage};
}
