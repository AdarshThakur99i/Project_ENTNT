

// mockdata
const TAG_POOL = ['React', 'TypeScript', 'Node.js', 'Remote', 'Full-time', 'GraphQL', 'CSS', 'Senior'];



let ALL_JOBS = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  title: `Software Engineer ${i + 1}`,
  status: i % 3 === 0 ? 'archived' : 'active' as 'active' | 'archived',
  tags: [TAG_POOL[i % TAG_POOL.length], TAG_POOL[(i + 3) % TAG_POOL.length]],
}));


// --- DATA LOGIC FUNCTIONS ---

export const fetchJobs = async (page: number, limit: number, filters: any) => {
  console.log("LOGIC: Fetching with filters:", filters);
  
  let filteredJobs = ALL_JOBS.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(filters.title.toLowerCase());
    const statusMatch = filters.status === 'all' || job.status === filters.status;
    const tagsMatch = filters.tags.length === 0 || filters.tags.some((tag: string) => job.tags.includes(tag));
    return titleMatch && statusMatch && tagsMatch;
  });

  return new Promise<{ data: any[]; totalCount: number }>((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = filteredJobs.slice(start, end);
      resolve({ data: paginatedData, totalCount: filteredJobs.length });
    }, 500);
  });
};

export const createJob = async (jobData: any) => {
  console.log("LOGIC: Creating job...", jobData);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = ALL_JOBS.length > 0 ? Math.max(...ALL_JOBS.map(j => j.id)) + 1 : 1;
      const newJob = { ...jobData, id: newId };
      ALL_JOBS.unshift(newJob);
      console.log("LOGIC: Job created.");
      resolve(newJob);
    }, 500);
  });
};

export const updateJob = async (jobData: any) => {
  console.log("LOGIC: Updating job...", jobData);
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = ALL_JOBS.findIndex(j => j.id === jobData.id);
      if (index !== -1) {
        ALL_JOBS[index] = { ...ALL_JOBS[index], ...jobData };
      }
      console.log(" LOGIC: Job updated.");
      resolve(ALL_JOBS[index]);
    }, 500);
  });
};

export const saveJobOrder = async (jobs: any[]): Promise<void> => {
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
        const index = ALL_JOBS.findIndex(j => j.id === id);
        if (index !== -1) {
            ALL_JOBS[index].status = status as 'active' | 'archived';
        }
        console.log("LOGIC: Success: Status updated.");
        resolve();
      } else {
        console.error("LOGIC: Failure: Could not update status (Intentional Error).");
        reject(new Error("Database update failed!"));
      }
    }, 500);
  });
};

export const getTags = () => TAG_POOL;