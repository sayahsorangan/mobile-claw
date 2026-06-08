export type LanguageCode = 'en' | 'id' | 'de';

export type LocalizedLabels = Record<LanguageCode, string>;

export type LabeledOption<TId extends string = string> = {
  id: TId;
  labels: LocalizedLabels;
};

export type SelectableOption<TId extends string = string> = LabeledOption<TId> & {
  blockId?: number;
  icon: string;
};
