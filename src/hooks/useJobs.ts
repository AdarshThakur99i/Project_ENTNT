

import { useState, useRef, useEffect } from 'react';


const JOBS_PER_PAGE = 5;
const TAG_POOL = ['React', 'TypeScript', 'Node.js', 'Remote', 'Full-time', 'GraphQL', 'CSS', 'Senior'];
const ALL_JOBS = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  title: `Software Engineer ${i + 1}`,
  status: i % 3 === 0 ? 'archived' : 'active' as 'active' | 'archived',
  tags: [TAG_POOL[i % TAG_POOL.length], TAG_POOL[(i + 3) % TAG_POOL.length]],
}));

const fetchJobsFromDB = async (page: number, limit: number) => {

  return new Promise<{ data: any[]; totalCount: number }>((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = ALL_JOBS.slice(start, end);
      resolve({ data: paginatedData, totalCount: ALL_JOBS.length });
    }, 700);
  });
};

const saveOrderToDB = async (jobs: any[]): Promise<void> => {
  console.log("Attempting to save new order to DB...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
     
      if (Math.random() > 0.05) {
        console.log(" Success: Order saved.");
        resolve();
      } else {
        console.error(" Failure: Could not save order (Intentional Error).");
        reject(new Error("Database write failed!"));
      }
    }, 1000); 
  });
};


export const useJobs = () => {
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // DATA FETCHING EFFECT
  useEffect(() => {
    const getJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetchJobsFromDB(currentPage, JOBS_PER_PAGE);
        setJobs(response.data);
        setTotalPages(Math.ceil(response.totalCount / JOBS_PER_PAGE));
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getJobs();
  }, [currentPage]);

  // DRAG & DROP REFS AND HANDLERS 
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  const handleDragStart = (index: number) => { dragItem.current = index; };
  const handleDragEnter = (index: number) => { dragOverItem.current = index; };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); };

  const handleDrop = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const originalJobs = [...jobs];
    const newJobs = [...originalJobs];
    const draggedItemContent = newJobs.splice(dragItem.current, 1)[0];
    newJobs.splice(dragOverItem.current, 0, draggedItemContent);
    setJobs(newJobs);

    dragItem.current = null;
    dragOverItem.current = null;

    try {
      await saveOrderToDB(newJobs);
    } catch (error) {
      alert("Error: Could not save the new order. Reverting changes(this is developer generated error(of 5%) to test rollback and optimistic update features).");
      setJobs(originalJobs);
    }
  };


  const handleArchive = async (id: number) => {
    const originalJobs = [...jobs];
    const updatedJobs = originalJobs.map(job =>
      job.id === id
        ? { ...job, status: job.status === 'active' ? 'archived' : 'active' }
        : job
    );
    setJobs(updatedJobs);

    try {
      await new Promise(res => setTimeout(res, 500)); 
    } catch (error) {
      alert("Error: Could not update job status. Reverting.");
      setJobs(originalJobs);
    }
  };
  
 
  const handlePageChange = (newPage: number) => {
      if (newPage > 0 && newPage <= totalPages) {
          setCurrentPage(newPage);
      }
  }

  return {
    jobs,
    isLoading,
    currentPage,
    totalPages,
    handleArchive,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDrop,
    handlePageChange,
  };
};