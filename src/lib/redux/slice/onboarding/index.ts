import {storeKey} from '@lib/redux/store-key';
import {persistReducer} from '@lib/storage/redux-storage';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {AccessModelOptionId} from '@screens/onboarding/types/access-model-option';
import type {SelectableOption} from '@screens/onboarding/types/selectable-option';

export type OnboardingState = {
  competencyOptions: SelectableOption[];
  onboardingSessionId: number | null;
  selectedAccessModelId: AccessModelOptionId | null;
  selectedEntryLevelId: string | null;
  selectedCompetencyId: string | null;
  selectedExperienceId: string | null;
  selectedGoalMotivationIds: string[];
  selectedSourceIds: string[];
  selectedSubtopicId: string | null;
  subtopicOptions: SelectableOption[];
  selectedTimeCommitmentId: string | null;
  topicIntent: string;
};

const initialState: OnboardingState = {
  competencyOptions: [],
  onboardingSessionId: null,
  selectedAccessModelId: null,
  selectedEntryLevelId: null,
  selectedCompetencyId: null,
  selectedExperienceId: null,
  selectedGoalMotivationIds: [],
  selectedSourceIds: [],
  selectedSubtopicId: null,
  subtopicOptions: [],
  selectedTimeCommitmentId: null,
  topicIntent: '',
};

const slice = createSlice({
  name: storeKey.Onboarding,
  initialState,
  reducers: {
    setCompetencyOptions: (state, {payload}: PayloadAction<SelectableOption[]>) => {
      state.competencyOptions = payload;
    },
    setSubtopicOptions: (state, {payload}: PayloadAction<SelectableOption[]>) => {
      state.subtopicOptions = payload;
    },
    setOnboardingSessionId: (state, {payload}: PayloadAction<number | null>) => {
      state.onboardingSessionId = payload;
    },
    selectAccessModel: (state, {payload}: PayloadAction<AccessModelOptionId | null>) => {
      state.selectedAccessModelId = payload;
    },
    selectCompetency: (state, {payload}: PayloadAction<string | null>) => {
      state.selectedCompetencyId = payload;
      state.selectedEntryLevelId = null;
      state.selectedExperienceId = null;
      state.selectedGoalMotivationIds = [];
      state.selectedSourceIds = [];
      state.selectedSubtopicId = null;
      state.subtopicOptions = [];
      state.selectedTimeCommitmentId = null;
    },
    selectEntryLevel: (state, {payload}: PayloadAction<string | null>) => {
      state.selectedEntryLevelId = payload;
    },
    selectExperience: (state, {payload}: PayloadAction<string | null>) => {
      state.selectedExperienceId = payload;
    },
    selectSubtopic: (state, {payload}: PayloadAction<string | null>) => {
      state.selectedSubtopicId = payload;
      state.selectedEntryLevelId = null;
      state.selectedExperienceId = null;
      state.selectedGoalMotivationIds = [];
      state.selectedSourceIds = [];
      state.selectedTimeCommitmentId = null;
    },
    selectTimeCommitment: (state, {payload}: PayloadAction<string | null>) => {
      state.selectedTimeCommitmentId = payload;
    },
    setTopicIntentAndResetDependents: (state, {payload}: PayloadAction<string>) => {
      state.topicIntent = payload;
      state.competencyOptions = [];
      state.selectedCompetencyId = null;
      state.selectedEntryLevelId = null;
      state.selectedExperienceId = null;
      state.selectedGoalMotivationIds = [];
      state.selectedSourceIds = [];
      state.selectedSubtopicId = null;
      state.subtopicOptions = [];
      state.selectedTimeCommitmentId = null;
      state.selectedAccessModelId = null;
    },
    toggleGoalMotivation: (state, {payload}: PayloadAction<string>) => {
      const idx = state.selectedGoalMotivationIds.indexOf(payload);
      if (idx >= 0) {
        state.selectedGoalMotivationIds.splice(idx, 1);
      } else {
        state.selectedGoalMotivationIds.push(payload);
      }
    },
    toggleSource: (state, {payload}: PayloadAction<string>) => {
      const idx = state.selectedSourceIds.indexOf(payload);
      if (idx >= 0) {
        state.selectedSourceIds.splice(idx, 1);
      } else {
        state.selectedSourceIds.push(payload);
      }
    },
    resetOnboarding: state => {
      Object.assign(state, initialState);
    },
  },
});

export const onboarding_action = slice.actions;

export const OnboardingReducer = persistReducer({key: storeKey.Onboarding}, slice.reducer);

export function canContinueFromTopic(state: OnboardingState): boolean {
  return state.topicIntent.trim().length > 0;
}

export function canContinueFromCompetency(state: OnboardingState): boolean {
  return state.selectedCompetencyId !== null;
}

export function canContinueFromSubtopic(state: OnboardingState): boolean {
  return state.selectedSubtopicId !== null;
}

export function canContinueFromExperience(state: OnboardingState): boolean {
  return state.selectedExperienceId !== null;
}

export function canContinueFromGoalMotivation(state: OnboardingState): boolean {
  return state.selectedGoalMotivationIds.length > 0;
}

export function canContinueFromTimeCommitment(state: OnboardingState): boolean {
  return state.selectedTimeCommitmentId !== null;
}

export function canContinueFromEntryLevel(state: OnboardingState): boolean {
  return state.selectedEntryLevelId !== null;
}

export function canContinueFromAccessModel(state: OnboardingState): boolean {
  return state.selectedAccessModelId !== null;
}
