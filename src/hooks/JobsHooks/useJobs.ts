import { useState, useEffect } from 'react';
import * as jobsApi from '../../api/JobsApi/JobsApi';
import { useDragAndDrop } from './useDragAndDrop';
import type { Job } from '../../data/JobsData/Jobs.types';

const JOBS_PER_PAGE = 5;

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
 const [currentPage, setCurrentPage] = useState<number>(1);
const [totalPages, setTotalPages] = useState<number>(0);
  

type JobFilters = {
  search: string;
  status: string;
  tags: string[];
};

const [filters, setFilters] = useState<JobFilters>({
  search: '',
  status: 'all',
  tags: [],
});

 
  const refetchTags = async () => { 
    const tagsResponse = await jobsApi.fetchTags();
    setAllTags(tagsResponse);
  };

  useEffect(() => {
    const getJobsAndTags = async () => {
      setIsLoading(true);
      try {
        const [jobsResponse, tagsResponse]: [{ data: Job[]; totalCount: number }, string[]] = await Promise.all([
          jobsApi.fetchJobs({ page: currentPage, pageSize: JOBS_PER_PAGE, ...filters }),
          jobsApi.fetchTags()
        ]);
        
        setJobs(jobsResponse.data);
        setTotalPages(Math.ceil(jobsResponse.totalCount / JOBS_PER_PAGE));
        setAllTags(tagsResponse);
      } catch (error) {
        console.error("Failed to fetch jobs or tags:", error);
        setJobs([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };
    getJobsAndTags();
  }, [currentPage, filters]);

  const refetchJobs = async () => {
    setIsLoading(true);
    const pageNumber = currentPage ?? 1;
    try {
      const response: { data: Job[]; totalCount: number } = 
await jobsApi.fetchJobs({
  page: pageNumber,
  pageSize: JOBS_PER_PAGE,
  ...filters,
});
      setJobs(response.data);
      setTotalPages(Math.ceil(response.totalCount / JOBS_PER_PAGE));
    } catch (error) {
      console.error("Failed to refetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // This function correctly expects all properties of a Job except 'id'.
  const handleCreateJob = async (formData: Omit<Job, 'id'>) => {
    try {
      await jobsApi.createJob(formData);
      refetchJobs(); 
      refetchTags(); 
      alert("Job created successfully!");
    } catch (error) {
      alert("Error: Could not create the job.");
    }
  };
  
  // This function correctly expects a complete Job object, including the 'id'.
  const handleUpdateJob = async (formData: Job) => {
    try {
      await jobsApi.updateJob(formData.id, formData);
      alert("Job updated successfully!");
      refetchJobs();
      refetchTags();
    } catch (error) {
      alert("Error: Could not update the job.");
    }
  };

  const handleFilterChange = <K extends keyof JobFilters>(
  filterName: K,
  value: JobFilters[K]
) => {
  setFilters(prev => ({
    ...prev,
    [filterName]: value,
  } as JobFilters));

  setCurrentPage(1);
};
  const handleReorderJobs = async (reorderedJobs: Job[]) => {
    const originalJobs = [...jobs];
    setJobs(reorderedJobs); 
    
    try {
   
      const jobsToSave = reorderedJobs.map((job, index) => ({...job, order: index}));
      await jobsApi.saveJobOrder(jobsToSave);
    } catch (error) {
      console.error("Reorder failed:", error);
      alert("Error: Could not save the new job order. Reverting changes(intentional 5% error to check rollback features).");
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

