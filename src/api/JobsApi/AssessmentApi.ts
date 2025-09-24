import type { Assessment, AssessmentResponse } from "../../data/AssessmentFunctions/assessment";

export async function fetchAssessmentsForJob(jobId: number): Promise<Assessment[]> {
  const response = await fetch(`/api/jobs/${jobId}/assessments`);
  if (!response.ok) {
    throw new Error('Failed to fetch assessments! try reloading the app');
  }
  return response.json();
}

export async function fetchAssessmentById(assessmentId: number): Promise<Assessment | null> {
    const response = await fetch(`/api/assessments/${assessmentId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch assessment try reloading the app');
    }
    if (response.status === 204) return null; // Handle "Not Found" case
    return response.json();
}

export async function createAssessment(jobId: number, assessmentData: Omit<Assessment, 'id'>): Promise<Assessment> {
  const response = await fetch(`/api/jobs/${jobId}/assessments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assessmentData),
  });
  if (!response.ok) {
    throw new Error('Failed to create assessmen! try reloading the app');
  }
  return response.json();
}

export async function deleteAssessment(assessmentId: number): Promise<void> {
  const response = await fetch(`/api/assessments/${assessmentId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete assessment! try reloading the app!');
  }
}

export async function saveAssessmentResponse(responseData: Omit<AssessmentResponse, 'id'>): Promise<AssessmentResponse> {
  const response = await fetch('/api/assessments/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(responseData),
  });
  if (!response.ok) {
    throw new Error('Failed to save assessment response! try relaoding');
  }
  return response.json();
}

export async function updateAssessment(assessment: Assessment): Promise<Assessment> {
  const response = await fetch(`/api/assessments/${assessment.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assessment),
  });
  if (!response.ok) {
    throw new Error('Failed to update assessment! try reloading');
  }
  return response.json();
}
