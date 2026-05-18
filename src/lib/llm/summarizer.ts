/**
 * Conversation summarizer.
 *
 * Uses the already-loaded chat LLM to compress old message history into a
 * short bullet-point summary.  Called in the background (fire-and-forget)
 * after the summarization threshold is reached.
 *
 * Design constraints:
 *  - Works with any 1B-3B instruction-tuned model (Llama, Qwen, Gemma…)
 *  - Low temperature (0.3) for deterministic, factual output
 *  - Hard cap at 200 output tokens to keep it cheap
 *  - Falls back to the previous summary on any error
 */

import {LlamaContext} from 'llama.rn';

const SUMMARIZE_SYSTEM =
  'You are a concise assistant that summarises conversations. ' +
  'Output ONLY bullet points (starting with "- "). No preamble, no conclusion. ' +
  'Maximum 5 bullets.';

const MAX_SUMMARY_TOKENS = 200;
const MAX_HISTORY_CHARS_PER_MSG = 300;

/**
 * Summarises a list of messages, optionally extending a previous summary.
 *
 * @param context  Active llama.rn LlamaContext
 * @param messages Recent messages to summarise (chronological order)
 * @param previousSummary  Existing summary to extend (optional)
 * @returns New summary text, or previousSummary if generation fails
 */
export async function summarizeConversation(
  context: LlamaContext,
  messages: Array<{role: string; content: string}>,
  previousSummary?: string,
): Promise<string> {
  if (messages.length === 0) {
    return previousSummary ?? '';
  }

  const history = messages
    .map(m => {
      const label = m.role === 'user' ? 'User' : 'Assistant';
      const snippet =
        m.content.length > MAX_HISTORY_CHARS_PER_MSG
          ? m.content.slice(0, MAX_HISTORY_CHARS_PER_MSG - 3) + '...'
          : m.content;
      return `${label}: ${snippet}`;
    })
    .join('\n');

  const userPrompt = previousSummary?.trim()
    ? `Existing summary:\n${previousSummary}\n\nNew exchanges to integrate:\n${history}\n\nUpdate the summary. Keep it under 5 bullet points. Be concise.`
    : `Summarise this conversation in bullet points (max 5 bullets):\n\n${history}`;

  try {
    const result = await context.completion(
      {
        messages: [
          {role: 'system', content: SUMMARIZE_SYSTEM},
          {role: 'user', content: userPrompt},
        ],
        n_predict: MAX_SUMMARY_TOKENS,
        temperature: 0.3,
        top_p: 0.9,
        enable_thinking: false,
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
      // No token callback — we only need the final text
    );

    // llama.rn returns { text: string } but types vary; access safely
    const text = (result as any)?.text?.trim();
    return text || previousSummary || '';
  } catch {
    // Never crash — silently return old summary
    return previousSummary ?? '';
  }
}
