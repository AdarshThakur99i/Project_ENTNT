
import { TAG_POOL, type Job, type JobStatus } from '../../data/JobsData/Jobs.types';
import { 
  getAllJobs, 
  addJob, 
  updateJobInData, 
  findJobById, 
  updateJobStatusInData, 
  getNextJobId 
} from '../../data/JobsData/dataFunctions';
export { TAG_POOL, type Job, type JobStatus };

export const getJobById = async (id: number): Promise<Job | null> => {
  console.log(`LOGIC: Fetching job with ID: ${id}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const job = findJobById(id);
      resolve(job || null);
    }, 300);
  });
};

export const fetchJobs = async (
  page: number, 
  limit: number, 
  filters: { title: string; status: string; tags: string[] }
): Promise<{ data: Job[]; totalCount: number }> => {
  console.log("LOGIC: Fetching with filters:", filters);
  
  const allJobs = getAllJobs();
  
  const filteredJobs = allJobs.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(filters.title.toLowerCase());
    const statusMatch = filters.status === 'all' || job.status === filters.status;
    const tagsMatch = filters.tags.length === 0 || filters.tags.some((tag: string) => job.tags.includes(tag));
    return titleMatch && statusMatch && tagsMatch;
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = filteredJobs.slice(start, end);
      resolve({ data: paginatedData, totalCount: filteredJobs.length });
    }, 500);
  });
};

export const createJob = async (jobData: Omit<Job, 'id'>): Promise<Job> => {
  console.log("LOGIC: Creating job...", jobData);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = getNextJobId();
      const newJob: Job = { ...jobData, id: newId };
      addJob(newJob);
      console.log("LOGIC: Job created.");
      resolve(newJob);
    }, 500);
  });
};

export const updateJob = async (jobData: Job): Promise<Job | null> => {
  console.log("LOGIC: Updating job...", jobData);
  return new Promise((resolve) => {
    setTimeout(() => {
      updateJobInData(jobData);
      const updatedJob = findJobById(jobData.id);
      console.log("LOGIC: Job updated.");
      resolve(updatedJob || null);
    }, 500);
  });
};

export const saveJobOrder = async (jobs: Job[]): Promise<void> => {
  console.log("LOGIC: Attempting to save new order...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { 
        console.log("LOGIC: Success: Order saved.");
        resolve();
      } else {
        console.error("LOGIC: Failure: Could not save order (Intentional Error).");
        reject(new Error("Database write failed!"));
      }
    }, 1000);
  });
};

export const updateJobStatus = async (id: number, status: string): Promise<void> => {
  console.log(`LOGIC: Attempting to update status for job ${id}...`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        updateJobStatusInData(id, status as JobStatus);
        console.log("LOGIC: Success: Status updated.");
        resolve();
      } else {
        console.error("LOGIC: Failure: Could not update status (Intentional Error).");
        reject(new Error("Database update failed!"));
      }
    }, 500);
  });
};

export const getTags = (): string[] => TAG_POOL;