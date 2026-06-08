import type {LabeledOption, LocalizedLabels} from './selectable-option';

export type TimeCommitmentOption<TId extends string = string> = LabeledOption<TId> & {
  estimateLabels: LocalizedLabels;
};
