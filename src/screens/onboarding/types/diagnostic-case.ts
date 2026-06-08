export type DiagnosticCaseOption = {
  id: string;
  label: string;
};

export type DiagnosticCase = {
  id: string;
  correctOptionIds: string[];
  options: DiagnosticCaseOption[];
  question: string;
  situation: string;
};
