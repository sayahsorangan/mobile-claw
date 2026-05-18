/**
 * Structured prompt builder with per-section token budgets.
 *
 * Implements the recommended prompt structure:
 *   SYSTEM → SUMMARY → SEMANTIC MEMORIES → RECENT CHAT → RAG CONTEXT → USER MESSAGE
 *
 * Each section is trimmed to its budget before assembly.
 */

import {RECENT_MESSAGES_TO_KEEP, TOKEN_BUDGET, trimToTokenBudget} from './token-budget';

export interface PromptContext {
  /** Base system instruction */
  systemPrompt: string;
  /** Language override ('auto' = no instruction injected) */
  language?: string;
  /** Layer 2: Compressed summary of older conversation turns */
  conversationSummary?: string;
  /** Layer 3: Short key facts about the user, e.g. "User builds React Native apps" */
  semanticMemories?: string[];
  /** Layer 1: Recent raw message pairs to include verbatim */
  recentMessages: Array<{role: 'user' | 'assistant'; content: string}>;
  /** Retrieved RAG chunks (plain text, pre-scored) */
  ragChunks?: string[];
  /** The current user turn */
  userMessage: string;
}

/** Assembled message array ready to pass to llama.rn context.completion() */
export type BuiltMessage = {role: 'system' | 'user' | 'assistant'; content: string};

/**
 * Assembles a full, budget-aware prompt from all memory layers.
 *
 * Sections are injected into the system message (rather than separate
 * system turns) so they work correctly with all model chat templates.
 */
export function buildPromptMessages(ctx: PromptContext): BuiltMessage[] {
  const langSuffix = ctx.language && ctx.language !== 'auto' ? ` Always respond in ${ctx.language}.` : '';

  // ── System core ───────────────────────────────────────────────────────────
  let systemContent = trimToTokenBudget(ctx.systemPrompt, TOKEN_BUDGET.system) + langSuffix;

  // ── Layer 2: Conversation summary ─────────────────────────────────────────
  if (ctx.conversationSummary?.trim()) {
    const summary = trimToTokenBudget(ctx.conversationSummary.trim(), TOKEN_BUDGET.summary);
    systemContent += `\n\n[CONVERSATION SO FAR]\n${summary}`;
  }

  // ── Layer 3: Semantic memories / key facts ────────────────────────────────
  if (ctx.semanticMemories?.length) {
    const facts = ctx.semanticMemories.slice(0, 5).join('\n- ');
    const memoriesText = trimToTokenBudget('- ' + facts, TOKEN_BUDGET.semanticMemory);
    systemContent += `\n\n[KEY CONTEXT ABOUT THE USER]\n${memoriesText}`;
  }

  // ── RAG context ───────────────────────────────────────────────────────────
  if (ctx.ragChunks?.length) {
    const ragText = trimToTokenBudget(ctx.ragChunks.join('\n\n'), TOKEN_BUDGET.ragContext);
    systemContent += `\n\n[INTERNAL KNOWLEDGE]\n${ragText}\n[/INTERNAL KNOWLEDGE]`;
  }

  // ── Layer 1: Recent messages ──────────────────────────────────────────────
  // Allocate budget evenly across the messages we keep
  const maxCharsPerMsg = Math.floor((TOKEN_BUDGET.recentMessages * 4) / Math.max(RECENT_MESSAGES_TO_KEEP, 1));
  let recent: BuiltMessage[] = ctx.recentMessages.slice(-RECENT_MESSAGES_TO_KEEP).map(m => ({
    role: m.role,
    content: m.content.length > maxCharsPerMsg ? m.content.slice(0, maxCharsPerMsg - 3) + '...' : m.content,
  }));

  // Chat templates require the conversation to start with a user turn.
  // Drop any leading assistant messages that can occur when a room is loaded
  // from SQLite with a prior AI greeting, or after summarization trims history.
  while (recent.length > 0 && recent[0]?.role !== 'user') {
    recent = recent.slice(1);
  }

  // ── Current user turn ─────────────────────────────────────────────────────
  const trimmedUser = trimToTokenBudget(ctx.userMessage, TOKEN_BUDGET.userPrompt);

  return [{role: 'system', content: systemContent}, ...recent, {role: 'user', content: trimmedUser}];
}
