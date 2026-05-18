import {LlamaContext} from 'llama.rn';

let _context: LlamaContext | null = null;
/**
 * Simple mutex flag — llama.cpp contexts are NOT thread-safe.
 * Only one context.completion() call may be active at a time.
 * Both useChat (sendMessage) and any fire-and-forget completions
 * (e.g. room title generation) must check and set this flag.
 */
let _busy = false;

export const LlamaManager = {
  getContext(): LlamaContext | null {
    return _context;
  },

  setContext(ctx: LlamaContext | null) {
    _context = ctx;
  },

  isBusy(): boolean {
    return _busy;
  },

  setBusy(busy: boolean) {
    _busy = busy;
  },

  async release() {
    if (_context) {
      await _context.release();
      _context = null;
    }
    _busy = false;
  },
};
