import { useState, useEffect } from 'react';
import * as jobsApi from '../../api/JobsApi/JobsApi';
import { useDragAndDrop } from './useDragAndDrop';
import type { Job, JobType, JobStatus } from '@/data/JobsData/Jobs.types';

const JOBS_PER_PAGE = 5;

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalJobsCount, setTotalJobsCount] = useState<number>(0);

  type JobFilters = {
    search: string;
    status: JobStatus | 'all';
    tags: string[];
    jobType: JobType[];
    experience: string; 
  };

  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    status: 'all',
    tags: [],
    jobType: [],
    experience: 'all',
  });
  
  const [sortBy, setSortBy] = useState('order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const fetchAndSetJobs = async () => {
    setIsLoading(true);
    try {
      const jobsResponse = await jobsApi.fetchJobs({
        page: currentPage,
        pageSize: JOBS_PER_PAGE,
        ...filters,
        sortBy,
        sortOrder,
      });
      const tagsResponse = await jobsApi.fetchTags();

      setJobs(jobsResponse.data);
      setTotalPages(Math.ceil(jobsResponse.totalCount / JOBS_PER_PAGE));
      setTotalJobsCount(jobsResponse.totalCount);
      setAllTags(tagsResponse);
    } catch (err) {
      console.error('Failed to fetch jobs or tags:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetJobs();
  }, [currentPage, filters, sortBy, sortOrder]);

  const refetchJobs = () => {
    fetchAndSetJobs();
  };

  const handleCreateJob = async (formData: Omit<Job, 'id'>) => {
    await jobsApi.createJob(formData);
    setCurrentPage(1);
    setFilters({ search: '', status: 'all', tags: [], jobType: [], experience: 'all' });
  };

  const handleUpdateJob = async (formData: Job) => {
    await jobsApi.updateJob(formData.id, formData);
    refetchJobs();
  };

  const handleFilterChange = <K extends keyof JobFilters>(
    filterName: K,
    value: JobFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };
  
  const handleSortChange = (newSortBy: string) => {
    if(sortBy === newSortBy) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };
  
  const handleReorderJobs = async (reorderedList: Job[]) => {
    const originalJobs = [...jobs];
    // The new list already has the correct visual order, we just need to update the `order` property
    const updatedListWithOrder = reorderedList.map((job, index) => ({ ...job, order: index }));

    setJobs(updatedListWithOrder); // Optimistic update

    try {
      await jobsApi.saveJobOrder(updatedListWithOrder);
    } catch (error) {
      console.error("Failed to save new order:", error);
      setJobs(originalJobs); // Revert on failure
      alert("Error: Could not save the new job order.");
    }
  };

  const { handleDragStart, handleDragEnter, handleDragOver, handleDrop } = 
    useDragAndDrop(jobs, handleReorderJobs);

  const handleArchive = async (id: number, currentStatus: JobStatus) => {
    const originalJobs = [...jobs];
    const newStatus: JobStatus = currentStatus === 'active' ? 'archived' : 'active';
    
    const updatedJobs = jobs.map(job => 
      job.id === id ? { ...job, status: newStatus } : job
    );
    setJobs(updatedJobs);

    try {
      await jobsApi.patchJob(id, { status: newStatus });
    } catch (error) {
      console.error("Failed to update job status:", error);
      setJobs(originalJobs);
      alert("Error: Could not update the job status.");
    }
  };

  return {
    jobs,
    isLoading,
    currentPage,
    totalPages,
    totalJobsCount,
    filters,
    allTags,
    sortBy,
    sortOrder,
    handleFilterChange,
    handlePageChange,
    handleCreateJob,
    handleUpdateJob,
    handleArchive,
    handleSortChange,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDrop,
  };
};