export type QuestionDetails =
  | { type: 'single-choice'; options: string[] }
  | { type: 'multi-choice'; options: string[] }
  | { type: 'short-text'; maxLength?: number }
  | { type: 'long-text'; maxLength?: number }
  | { type: 'numeric'; min?: number; max?: number }
  | { type: 'file-upload' };

export interface Question {
  id: string;
  text: string;
  isRequired: boolean;
  details: QuestionDetails;
  condition?: {
    questionId: string;
    value: any;
  };
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  sections: Section[];
}