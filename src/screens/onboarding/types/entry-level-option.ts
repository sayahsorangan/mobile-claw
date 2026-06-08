import type {LabeledOption, LocalizedLabels} from './selectable-option';

export type EntryLevelOptionId = 'diagnostic' | 'start-simple';

export type EntryLevelOption = LabeledOption<EntryLevelOptionId> & {
  descriptionLabels: LocalizedLabels;
  icon: string;
};
