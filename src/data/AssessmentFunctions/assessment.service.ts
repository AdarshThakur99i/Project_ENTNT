import type { Assessment } from './assessment';

const ASSESSMENT_KEY_PREFIX = 'assessment-';
const RESPONSE_KEY_PREFIX = 'response-';

/**
 * Saves a given assessment structure to localStorage, using its jobId to create a unique key.
 * @param assessment The complete assessment object to save.
 */
export const saveAssessment = (assessment: Assessment): void => {
  if (!assessment.jobId) {
    console.error("Cannot save assessment without a jobId.");
    return;
  }
  const key = `${ASSESSMENT_KEY_PREFIX}${assessment.jobId}`;
  localStorage.setItem(key, JSON.stringify(assessment));
  console.log(`Assessment for job ${assessment.jobId} saved.`);
};

/**
 * Loads an assessment structure for a specific jobId from localStorage.
 * @param jobId The ID of the job to load the assessment for.
 * @returns The parsed assessment object or null if not found.
 */
export const loadAssessment = (jobId: string): Assessment | null => {
  const key = `${ASSESSMENT_KEY_PREFIX}${jobId}`;
  const savedData = localStorage.getItem(key);

  if (savedData) {
    console.log(`Assessment for job ${jobId} loaded.`);
    return JSON.parse(savedData) as Assessment;
  }
  
  return null;
};

/**
 * Saves a candidate's responses for a given assessment.
 * @param jobId The ID of the job associated with the assessment.
 * @param candidateId The ID of the candidate submitting the response.
 * @param responses The form data object containing the candidate's answers.
 */
export const saveAssessmentResponse = (jobId: string, candidateId: string, responses: any): void => {
  const key = `${RESPONSE_KEY_PREFIX}${jobId}-${candidateId}`;
  localStorage.setItem(key, JSON.stringify(responses));
  console.log(`Response for candidate ${candidateId} on job ${jobId} saved.`);
};