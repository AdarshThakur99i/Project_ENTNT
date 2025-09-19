
import type { Job } from '../../data/JobsData/Jobs.types';

/**
 * Fetches a paginated and filtered list of jobs from the API.
 * @param params An object containing pagination and filter options.
 */
export async function fetchJobs(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}): Promise<{ data: Job[]; totalCount: number }> {
  const queryParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.search) {
    queryParams.append('search', params.search);
  }
  if (params.status) {
    queryParams.append('status', params.status);
  }
  
  const response = await fetch(`/api/jobs?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  
  return response.json();
}

/**
 * Creates a new job by sending data to the API.
 * @param jobData The new job to create, without an ID.
 */
export async function createJob(jobData: Omit<Job, 'id'>): Promise<Job> {
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    throw new Error('Failed to create job');
  }

  return response.json();
}

/**
 * Updates an existing job with new data.
 * @param jobId The ID of the job to update.
 * @param updates An object containing only the fields to change.
 */
export async function updateJob(jobId: number, updates: Partial<Job>): Promise<Job> {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update job');
  }

  return response.json();
}

/**
 * Fetches a single job by its ID from the API.
 * @param jobId The ID of the job to fetch.
 */
export async function fetchJobById(jobId: number): Promise<Job> {
  const response = await fetch(`/api/jobs/${jobId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch job with ID ${jobId}`);
  }

  return response.json();
}