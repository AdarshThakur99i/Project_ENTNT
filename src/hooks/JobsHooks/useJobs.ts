
import { useState, useEffect } from 'react';
import * as jobLogic from './createOrUpdateJobsLogic'; 
import { useDragAndDrop } from './useDragAndDrop';

const JOBS_PER_PAGE = 5;
const TAG_POOL = jobLogic.getTags(); 

export const useJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rerender, setRerender] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    status: 'all',
    tags: [] as string[],
  });

  useEffect(() => {
    const getJobs = async () => {
      setIsLoading(true);
      const response = await jobLogic.fetchJobs(currentPage, JOBS_PER_PAGE, filters);
      setJobs(response.data);
      setTotalPages(Math.ceil(response.totalCount / JOBS_PER_PAGE));
      setIsLoading(false);
    };
    getJobs();
  }, [currentPage, filters, rerender]);

  const handleCreateJob = async (formData: any) => {
    await jobLogic.createJob(formData);
    alert("Job created successfully!");
    setRerender(prev => !prev);
  };
  
 
  const handleUpdateJob = async (formData: any) => {
    
    await jobLogic.updateJob(formData);
    
    alert("Job updated successfully!");
    //refetch
    setRerender(prev => !prev); 
  };
  
  const handleFilterChange = (filterName: keyof typeof filters, value: any) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: value }));
    setCurrentPage(1); 
  };
  
  const handleReorderJobs = async (reorderedJobs: any[]) => {
    const originalJobs = [...jobs];
    setJobs(reorderedJobs);
    try {
      await jobLogic.saveJobOrder(reorderedJobs);
    } catch (error) {
      alert("Error: Could not save. Reverting changes(intentional error to test rollbacks).");
      setJobs(originalJobs);
    }
  };

  const { 
    handleDragStart, 
    handleDragEnter, 
    handleDragOver, 
    handleDrop 
  } = useDragAndDrop(jobs, handleReorderJobs);

  const handleArchive = async (id: number) => {
    const originalJobs = [...jobs];
    let newStatus = '';
    const updatedJobs = originalJobs.map(job => {
      if (job.id === id) {
        newStatus = job.status === 'active' ? 'archived' : 'active';
        return { ...job, status: newStatus };
      }
      return job;
    });
    setJobs(updatedJobs);

    try {
      await jobLogic.updateJobStatus(id, newStatus);
    } catch (error) {
      alert("Error: Could not update job status. Reverting(intentional error to test rollbacks).");
      setJobs(originalJobs);
    }
  };
  
  const handlePageChange = (newPage: number) => {
      if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
          setCurrentPage(newPage);
      }
  };

  return {
    jobs, isLoading, currentPage, totalPages,
    filters, TAG_POOL, handleFilterChange,
    handleArchive, handlePageChange,
    handleCreateJob, handleUpdateJob,
    handleDragStart, handleDragEnter, handleDragOver, handleDrop,
  };
};