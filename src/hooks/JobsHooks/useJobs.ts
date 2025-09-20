import { useState, useEffect } from 'react';
import * as jobsApi from '../../api/JobsApi/JobsApi';
import { useDragAndDrop } from './useDragAndDrop';

const JOBS_PER_PAGE = 5;

export const useJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    search: '', 
    status: 'all',
    tags: [] as string[],
  });

  const refetchTags = async () => {
    const tagsResponse = await jobsApi.fetchTags();
    setAllTags(tagsResponse);
  };

  useEffect(() => {
    const getJobsAndTags = async () => {
      setIsLoading(true);
      const [jobsResponse, tagsResponse] = await Promise.all([
        jobsApi.fetchJobs({ page: currentPage, pageSize: JOBS_PER_PAGE, ...filters }),
        jobsApi.fetchTags()
      ]);
      
      setJobs(jobsResponse.data);
      setTotalPages(Math.ceil(jobsResponse.totalCount / JOBS_PER_PAGE));
      setAllTags(tagsResponse);
      setIsLoading(false);
    };
    getJobsAndTags();
  }, [currentPage, filters]);

  const refetchJobs = async () => {
    setIsLoading(true);
    const response = await jobsApi.fetchJobs({
      page: currentPage,
      pageSize: JOBS_PER_PAGE,
      ...filters,
    });
    setJobs(response.data);
    setTotalPages(Math.ceil(response.totalCount / JOBS_PER_PAGE));
    setIsLoading(false);
  };

  const handleCreateJob = async (formData: any) => {
  try {
    const newJob = await jobsApi.createJob(formData);
    
    setJobs(prevJobs => [newJob, ...prevJobs]);
    
    refetchTags(); 
    
    alert("Job created successfully!");
  } catch (error) {
    alert("Error: Could not create the job.");
  }
};
  
  const handleUpdateJob = async (formData: any) => {
    await jobsApi.updateJob(formData.id, formData);
    alert("Job updated successfully!");
    refetchJobs();
    refetchTags();
  };

  const handleFilterChange = (filterName: keyof typeof filters, value: any) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: value }));
    setCurrentPage(1); 
  };
  
  const handleReorderJobs = async (reorderedJobs: any[]) => {
    const originalJobs = [...jobs];
    setJobs(reorderedJobs); 
    
    try {
      await jobsApi.saveJobOrder(reorderedJobs);
    } catch (error) {
      console.error("Reorder failed:", error);
      alert("Error: Could not save the new job order. Reverting changes(intential 10% error to test optimistic updates and rollback features).");
      setJobs(originalJobs);
    }
  };

  const { 
    handleDragStart, 
    handleDragEnter, 
    handleDragOver, 
    handleDrop 
  } = useDragAndDrop(jobs, handleReorderJobs);

  const handleArchive = async (id: number, currentStatus: string) => {
  const originalJobs = [...jobs];
  const newStatus = currentStatus === 'active' ? 'archived' : 'active';

  const updatedJobs = jobs.map(job => 
    job.id === id ? { ...job, status: newStatus } : job
  );
  setJobs(updatedJobs);

  try {
    await jobsApi.patchJob(id, { status: newStatus });
  } catch (error) {
   
    alert("Error: Could not update job status. Reverting changes.");
    setJobs(originalJobs);
  }
};
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  return {
    jobs, isLoading, currentPage, totalPages, filters, allTags,
    handleFilterChange, handleArchive, handlePageChange,
    handleCreateJob, handleUpdateJob,
    handleDragStart, handleDragEnter, handleDragOver, handleDrop,
  };
};