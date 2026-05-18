/**
 * Token budget management for mobile-optimised prompts.
 *
 * All estimates use the ~4 chars-per-token heuristic which is accurate
 * enough for budget calculations without requiring a real tokeniser.
 */

export const CHARS_PER_TOKEN = 4;

/** Approximate token count for a string */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/**
 * Truncate text so it fits within maxTokens.
 * Appends '...' when truncated.
 */
export function trimToTokenBudget(text: string, maxTokens: number): string {
  const maxChars = maxTokens * CHARS_PER_TOKEN;
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars - 3) + '...';
}

// ─── Per-section budgets (tokens) ──────────────────────────────────────────

/**
 * Maximum tokens allocated to each prompt section.
 * Total context target: ≤ 1700 tokens (prompt) + 256 (output) = ~1956.
 * Load model with n_ctx = 2048 to accommodate this safely.
 */
export const TOKEN_BUDGET = {
  system: 150, // System instruction
  summary: 300, // Conversation summary (Layer 2 memory)
  semanticMemory: 150, // Key facts about the user (Layer 3 memory)
  recentMessages: 300, // Last few raw exchanges (Layer 1 memory)
  ragContext: 400, // Retrieved document chunks
  userPrompt: 150, // Current user message
  outputReserve: 256, // Reserved for model output
  /** Sum of all input sections */
  totalInput: 1450,
} as const;

// ─── Summarization thresholds ───────────────────────────────────────────────

/** Trigger summarization when accumulated tokens exceed this */
export const SUMMARIZE_TOKEN_THRESHOLD = 1200;

/** Trigger summarization every N new messages (whichever comes first) */
export const SUMMARIZE_MESSAGE_THRESHOLD = 10;

/** Number of recent messages to keep in Redux after summarization */
export const RECENT_MESSAGES_TO_KEEP = 6;

/** Reset the LLM session prompt history every N messages */
export const SESSION_RESET_THRESHOLD = 20;

/** Recommended context window size for the loaded model (n_ctx) */
export const RECOMMENDED_CONTEXT_SIZE = 2048;

/** Recommended max output tokens (n_predict) */
export const RECOMMENDED_MAX_TOKENS = 256;
