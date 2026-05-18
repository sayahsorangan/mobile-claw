export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LoadModelOptions {
  /** Absolute path to the .gguf model file on device */
  modelPath: string;
  /** Number of GPU layers to offload. 0 = CPU only. -1 = all layers on GPU */
  nGpuLayers?: number;
  /** Context window size in tokens */
  contextSize?: number;
}

export interface GenerateOptions {
  /** Max tokens to generate (default: 256) */
  maxTokens?: number;
  /** Temperature 0.0–1.0 */
  temperature?: number;
  /** Top-p sampling */
  topP?: number;
  /** Called with each streamed token */
  onToken?: (token: string) => void;
  /**
   * @deprecated Pass ragChunks instead.
   * Override the prompt actually sent to the LLM (e.g. a RAG-augmented prompt).
   */
  llmPrompt?: string;
  /**
   * Pre-retrieved RAG chunk texts to inject into the prompt via the prompt builder.
   * Takes precedence over llmPrompt when both are provided.
   */
  ragChunks?: string[];
  /**
   * SQLite room ID used to look up the Layer-2 conversation summary and
   * track the per-room message count for auto-summarization.
   */
  roomId?: string;
}
