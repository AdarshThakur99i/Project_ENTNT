import type { Job, JobType } from "@/data/JobsData/Jobs.types";

interface FetchJobsParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  tags?: string[];
  jobType?: JobType[]; 
  experience?: string;
  sortBy?: string;      
  sortOrder?: 'asc' | 'desc'; 
}

export async function fetchJobs(params: FetchJobsParams): Promise<{ data: Job[]; totalCount: number }> {
  const queryParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.search) queryParams.append('search', params.search);
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);
  if (params.tags && params.tags.length > 0) params.tags.forEach(tag => queryParams.append('tags', tag));
  if (params.jobType && params.jobType.length > 0) params.jobType.forEach(type => queryParams.append('jobType', type));
  if (params.experience && params.experience !== 'all') queryParams.append('experience', params.experience);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  
  const response = await fetch(`/api/jobs?${queryParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch jobs');
  return response.json();
}

// Creates a new job
export async function createJob(jobData: Omit<Job, 'id'>): Promise<Job> {
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) throw new Error('Failed to create job');
  return response.json();
}

// Fully updates a job (using PUT)
export async function updateJob(jobId: number, jobData: Job): Promise<Job> {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) throw new Error('Failed to update job');
  return response.json();
}

// Partially updates a job (using PATCH)
export async function patchJob(jobId: number, updates: Partial<Job>): Promise<Job> {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to patch job');
  return response.json();
}

// Saves the new order of jobs.
export async function saveJobOrder(reorderedJobs: Job[]): Promise<void> {
  const response = await fetch('/api/jobs/reorder', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reorderedJobs }),
  });

  if (!response.ok) {
    throw new Error('Failed to save job order');
  }
}

// Fetches all unique tags
export async function fetchTags(): Promise<string[]> {
  const response = await fetch('/api/tags');
  if (!response.ok) throw new Error('Failed to fetch tags');
  return response.json();
}
export async function fetchJobById(jobId: number): Promise<Job> {
  const response = await fetch(`/api/jobs/${jobId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch job with ID ${jobId}`);
  }
  return response.json();
}

export async function deleteJob(jobId: number): Promise<void> {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete job');
  }
}