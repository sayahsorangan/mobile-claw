import {Api} from '@lib/ky';

import {
  StartOnboardingResponseDto,
  SubmitOnboardingStepParams,
  SubmitOnboardingStepResponseDto,
  SubmitOnboardingStepResult,
} from './types';

export async function startOnboardingSession(): Promise<number> {
  const response = await Api.post('api/onboarding/start', {}).json<StartOnboardingResponseDto>();

  return response.data?.flow_session?.id ?? 0;
}

export async function submitOnboardingStep({
  payload,
  sessionId,
  step,
}: SubmitOnboardingStepParams): Promise<SubmitOnboardingStepResult> {
  const response = Api.post('api/onboarding/step', {
    json: {
      payload,
      session_id: sessionId,
      step,
    },
  }).json<SubmitOnboardingStepResponseDto>();
  return response as any;
}

export const OnboardingServices = {
  startOnboardingSession,
  submitOnboardingStep,
};
