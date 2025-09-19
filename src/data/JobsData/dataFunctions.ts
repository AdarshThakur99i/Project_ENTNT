import { ALL_JOBS, type Job, type JobStatus } from './Jobs.types';

export const getAllJobs = (): Job[] => ALL_JOBS;

export const setAllJobs = (jobs: Job[]): void => {
  ALL_JOBS.length = 0;
  ALL_JOBS.push(...jobs);
};

export const addJob = (job: Job): void => {
  ALL_JOBS.unshift(job);
};

export const updateJobInData = (updatedJob: Job): void => {
  const index = ALL_JOBS.findIndex(j => j.id === updatedJob.id);
  if (index !== -1) {
    ALL_JOBS[index] = { ...ALL_JOBS[index], ...updatedJob };
  }
};

export const findJobById = (id: number): Job | undefined => {
  return ALL_JOBS.find(j => j.id === id);
};

export const updateJobStatusInData = (id: number, status: JobStatus): void => {
  const index = ALL_JOBS.findIndex(j => j.id === id);
  if (index !== -1) {
    ALL_JOBS[index].status = status;
  }
};

export const getNextJobId = (): number => {
  return ALL_JOBS.length > 0 ? Math.max(...ALL_JOBS.map(j => j.id)) + 1 : 1;
};

export const deleteJobFromData = (id: number): boolean => {
  const index = ALL_JOBS.findIndex(j => j.id === id);
  if (index !== -1) {
    ALL_JOBS.splice(index, 1);
    return true;
  }
  return false;
};

export const getJobsCount = (): number => {
  return ALL_JOBS.length;
};

export const clearAllJobs = (): void => {
  ALL_JOBS.length = 0;
};

export const getJobsByStatus = (status: JobStatus): Job[] => {
  return ALL_JOBS.filter(job => job.status === status);
};

export const searchJobs = (searchTerm: string): Job[] => {
  const lowercaseSearch = searchTerm.toLowerCase();
  return ALL_JOBS.filter(job => 
    job.title.toLowerCase().includes(lowercaseSearch) ||
    job.tags.some(tag => tag.toLowerCase().includes(lowercaseSearch))
  );
};