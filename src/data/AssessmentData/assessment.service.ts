import type { Assessment } from './assessment';

const ASSESSMENT_KEY_PREFIX = 'assessment-';

export const saveAssessment = (assessment: Assessment): void => {
  if (!assessment.jobId) {
    console.error("Cannot save assessment without a jobId.");
    return;
  }
  const key = `${ASSESSMENT_KEY_PREFIX}${assessment.jobId}`;
  localStorage.setItem(key, JSON.stringify(assessment));
  console.log(`Assessment for job ${assessment.jobId} saved.`);
};
export const loadAssessment = (jobId: string): Assessment | null => {
  const key = `${ASSESSMENT_KEY_PREFIX}${jobId}`;
  const savedData = localStorage.getItem(key);

  if (savedData) {
    console.log(`Assessment for job ${jobId} loaded.`);
    return JSON.parse(savedData) as Assessment;
  }
  
  return null;
};