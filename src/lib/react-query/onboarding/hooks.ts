import {useMQ, UseMQOptions} from '@react-query/custom-hooks';

import {OnboardingQueryKey} from './keys';
import {OnboardingServices} from './service';
import {SubmitOnboardingStepParams, SubmitOnboardingStepResult} from './types';

function useStartOnboardingSession(options?: UseMQOptions<number, void>) {
  return useMQ([OnboardingQueryKey.startSession], OnboardingServices.startOnboardingSession, options);
}

function useSubmitOnboardingStep(options?: UseMQOptions<SubmitOnboardingStepResult, SubmitOnboardingStepParams>) {
  return useMQ([OnboardingQueryKey.submitStep], OnboardingServices.submitOnboardingStep, options);
}

export const OnboardingQueries = {
  useStartOnboardingSession,
  useSubmitOnboardingStep,
};
