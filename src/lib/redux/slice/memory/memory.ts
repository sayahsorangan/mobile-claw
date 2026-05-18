import {persistReducer} from '@lib/storage/redux-storage';
import {storeKey} from '@redux-store/store-key';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MemoryState {
  /**
   * Layer 2: Compressed conversation summaries, keyed by roomId.
   * Generated every SUMMARIZE_MESSAGE_THRESHOLD new messages.
   */
  summaries: Record<string, string>;

  /**
   * Message exchange count since the last summarization, keyed by roomId.
   * Incremented after each user+assistant exchange.
   */
  messagesSinceLastSummary: Record<string, number>;

  /**
   * Layer 3: Global key facts extracted from all conversations.
   * Short strings like "User is building a React Native app".
   * Maximum 20 entries to keep memory lean.
   */
  semanticMemories: string[];
}

const initialState: MemoryState = {
  summaries: {},
  messagesSinceLastSummary: {},
  semanticMemories: [],
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const slice = createSlice({
  name: storeKey.Memory,
  initialState,
  reducers: {
    setSummary: (state, {payload}: PayloadAction<{roomId: string; summary: string}>) => {
      state.summaries[payload.roomId] = payload.summary;
    },
    deleteSummary: (state, {payload}: PayloadAction<string>) => {
      delete state.summaries[payload];
    },
    incrementMessageCount: (state, {payload}: PayloadAction<string>) => {
      state.messagesSinceLastSummary[payload] = (state.messagesSinceLastSummary[payload] ?? 0) + 1;
    },
    resetMessageCount: (state, {payload}: PayloadAction<string>) => {
      state.messagesSinceLastSummary[payload] = 0;
    },
    deleteRoomMemory: (state, {payload}: PayloadAction<string>) => {
      delete state.summaries[payload];
      delete state.messagesSinceLastSummary[payload];
    },
    addSemanticMemory: (state, {payload}: PayloadAction<string>) => {
      const fact = payload.trim();
      if (!fact || state.semanticMemories.includes(fact)) return;
      // Keep max 20 entries — drop oldest when full
      if (state.semanticMemories.length >= 20) {
        state.semanticMemories.shift();
      }
      state.semanticMemories.push(fact);
    },
    clearSemanticMemories: state => {
      state.semanticMemories = [];
    },
    onReset: () => initialState,
  },
});

export const memory_action = slice.actions;
export const MemoryReducer = persistReducer({key: storeKey.Memory}, slice.reducer);
