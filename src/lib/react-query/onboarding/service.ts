import {Api} from '@lib/ky';

import {
  StartOnboardingResponseDto,
  SubmitOnboardingStepParams,
  SubmitOnboardingStepResponseDto,
  SubmitOnboardingStepResult,
} from './types';

function extractErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const record = payload as Record<string, unknown>;
  if (typeof record.error === 'string' && record.error.trim()) {
    return record.error.trim();
  }
  if (typeof record.message === 'string' && record.message.trim()) {
    return record.message.trim();
  }
  if (record.data && typeof record.data === 'object') {
    const nested = record.data as Record<string, unknown>;
    if (typeof nested.error === 'string' && nested.error.trim()) {
      return nested.error.trim();
    }
    if (typeof nested.message === 'string' && nested.message.trim()) {
      return nested.message.trim();
    }
  }
  return null;
}

function shouldRestartSession(errorMessage: string | null): boolean {
  const msg = errorMessage?.trim().toLowerCase() ?? '';
  return msg.includes('flow session not found') || msg.includes('invalid step order');
}

function parseStepResponse(response: SubmitOnboardingStepResponseDto): SubmitOnboardingStepResult {
  const nextStep = response.data?.next_step ?? null;
  const resolvedSessionId = response.data?.flow_session?.id ?? null;
  const rawMeta = response.data?.meta;
  const meta =
    rawMeta && typeof rawMeta === 'object'
      ? {
          intent:
            typeof (rawMeta as Record<string, unknown>).intent === 'string'
              ? ((rawMeta as Record<string, unknown>).intent as string)
              : undefined,
          confidence:
            typeof (rawMeta as Record<string, unknown>).confidence === 'number'
              ? ((rawMeta as Record<string, unknown>).confidence as number)
              : undefined,
          query:
            typeof (rawMeta as Record<string, unknown>).query === 'string'
              ? ((rawMeta as Record<string, unknown>).query as string)
              : undefined,
          confirmed:
            typeof (rawMeta as Record<string, unknown>).confirmed === 'boolean'
              ? ((rawMeta as Record<string, unknown>).confirmed as boolean)
              : undefined,
          flow:
            typeof (rawMeta as Record<string, unknown>).flow === 'string'
              ? ((rawMeta as Record<string, unknown>).flow as string)
              : undefined,
          message:
            typeof (rawMeta as Record<string, unknown>).message === 'string'
              ? ((rawMeta as Record<string, unknown>).message as string)
              : undefined,
          source:
            typeof (rawMeta as Record<string, unknown>).source === 'string'
              ? ((rawMeta as Record<string, unknown>).source as string)
              : undefined,
          refinementType:
            typeof (rawMeta as Record<string, unknown>).refinement_type === 'string'
              ? ((rawMeta as Record<string, unknown>).refinement_type as string)
              : undefined,
          followUp:
            typeof (rawMeta as Record<string, unknown>).follow_up === 'string'
              ? ((rawMeta as Record<string, unknown>).follow_up as string)
              : undefined,
          refinementContext:
            (rawMeta as Record<string, unknown>).refinement_context &&
            typeof (rawMeta as Record<string, unknown>).refinement_context === 'object'
              ? ((rawMeta as Record<string, unknown>).refinement_context as Record<string, unknown>)
              : undefined,
        }
      : null;

  function toSelectableOption(name: string, id: number, blockId?: number) {
    const compactLabel = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2);
    return {
      ...(typeof blockId === 'number' ? {blockId} : {}),
      id: String(id),
      icon: compactLabel || 'AI',
      labels: {de: name, en: name, id: name} as {de: string; en: string; id: string},
    };
  }

  const options = (response.data?.data ?? [])
    .filter(entry => typeof entry?.id === 'number' && typeof entry?.name === 'string')
    .map(entry =>
      toSelectableOption(
        entry.name as string,
        entry.id as number,
        typeof entry.block_id === 'number' ? entry.block_id : undefined,
      ),
    );

  return {meta, options, nextStep, sessionId: resolvedSessionId ?? null};
}

export async function startOnboardingSession(): Promise<number> {
  const response = await Api.post('api/onboarding/start', {}).json<StartOnboardingResponseDto>();
  const id = response.data?.flow_session?.id;
  if (typeof id !== 'number') {
    throw new Error('Onboarding start response did not contain a session id.');
  }
  return id;
}

export async function submitOnboardingStep({
  payload,
  sessionId,
  step,
}: SubmitOnboardingStepParams): Promise<SubmitOnboardingStepResult> {
  const doRequest = (sid: number) =>
    Api.post('api/onboarding/step', {
      json: {payload, session_id: sid, step},
    }).json<SubmitOnboardingStepResponseDto>();

  let response = await doRequest(sessionId);

  if (response.success === false && shouldRestartSession(extractErrorMessage(response))) {
    const nextSessionId = await startOnboardingSession();
    response = await doRequest(nextSessionId);
    if (response.success === false) {
      throw new Error(extractErrorMessage(response) || 'Failed to submit onboarding step.');
    }
    const parsed = parseStepResponse(response);
    return {...parsed, sessionId: parsed.sessionId ?? nextSessionId};
  }

  if (response.success === false) {
    throw new Error(extractErrorMessage(response) || 'Failed to submit onboarding step.');
  }

  return parseStepResponse(response);
}

export const OnboardingServices = {
  startOnboardingSession,
  submitOnboardingStep,
};
