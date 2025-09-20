// Add these new types to your assessment.ts file

// 1. Define the detailed structures for each question type
interface ShortTextDetails {
  type: 'short-text';
  maxLength?: number;
}

interface LongTextDetails {
  type: 'long-text';
  maxLength?: number;
}

interface SingleChoiceDetails {
  type: 'single-choice';
  options: string[];
}

interface MultiChoiceDetails {
  type: 'multi-choice';
  options: string[];
}

interface NumericDetails {
  type: 'numeric';
  min?: number;
  max?: number;
}

interface FileUploadDetails {
  type: 'file-upload';
}

// 2. Export a union of all possible detail types as QuestionDetails
export type QuestionDetails =
  | ShortTextDetails
  | LongTextDetails
  | SingleChoiceDetails
  | MultiChoiceDetails
  | NumericDetails
  | FileUploadDetails;

// 3. Replace your old Question interface with this one
export interface Question {
  id: string;
  text: string;
  isRequired: boolean;
  details: QuestionDetails;
  condition?: {
    questionId: string;
    value: any;
  };
  correctAnswer?: any;
}


// --- Keep your other interfaces as they are ---

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface Assessment {
  id: number;
  jobId: number;
  title: string;
  sections: Section[];
}

export interface AssessmentResponse {
  id?: number;
  jobId: number;
  candidateId: number;
  responses: Record<string, any>;
}