export interface SelectableOption {
  blockId?: number;
  id: string;
  icon: string;
  labels: {
    de: string;
    en: string;
    id: string;
  };
}

export interface OnboardingStepMeta {
  intent?: string;
  confidence?: number;
  query?: string;
  confirmed?: boolean;
  flow?: string;
  message?: string;
  source?: string;
  refinementType?: string;
  followUp?: string;
  refinementContext?: Record<string, unknown>;
}

export interface StartOnboardingResponseDto {
  success: boolean;
  error?: string;
  data?: {
    flow_session?: {
      id?: number;
      flow_type?: string;
      current_step?: string;
      status?: string;
      data?: Record<string, unknown>;
    };
  };
}

export interface SubmitOnboardingStepParams {
  payload: Record<string, unknown>;
  sessionId: number;
  step: string;
}

export interface SubmitOnboardingStepResponseDto {
  success: boolean;
  error?: string;
  message?: string;
  data?: {
    next_step?: string;
    data?: Array<{
      block_id?: number;
      id?: number;
      name?: string;
    }>;
    meta?: Record<string, unknown>;
    flow_session?: {
      id?: number;
      flow_type?: string;
      current_step?: string;
      status?: string;
      data?: Record<string, unknown>;
    };
  };
}

export interface SubmitOnboardingStepResult {
  meta: OnboardingStepMeta | null;
  options: SelectableOption[];
  nextStep: string | null;
  sessionId: number | null;
}
