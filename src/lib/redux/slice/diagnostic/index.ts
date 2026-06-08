import {storeKey} from '@lib/redux/store-key';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type DiagnosticAnswer = {
  caseId: string;
  selectedOptionIds: string[];
};

export type DiagnosticState = {
  answers: DiagnosticAnswer[];
};

const initialState: DiagnosticState = {
  answers: [],
};

const slice = createSlice({
  name: storeKey.Diagnostic,
  initialState,
  reducers: {
    submitAnswer: (state, {payload}: PayloadAction<{caseId: string; selectedOptionIds: string[]}>) => {
      const idx = state.answers.findIndex(a => a.caseId === payload.caseId);
      if (idx >= 0) {
        state.answers[idx] = payload;
      } else {
        state.answers.push(payload);
      }
    },
    resetDiagnostic: state => {
      state.answers = [];
    },
  },
});

export const diagnostic_action = slice.actions;
export const DiagnosticReducer = slice.reducer;
