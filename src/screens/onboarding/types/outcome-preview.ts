export type OutcomePreviewCardId = 'week' | 'month' | 'quarter';

export type OutcomePreviewCard = {
  body: string;
  id: OutcomePreviewCardId;
  title: string;
};
