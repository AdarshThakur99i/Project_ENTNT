import React, { useState } from 'react';
import type { Job } from '../data/JobsData/Jobs.types'; 
import { useJobs } from '../hooks/JobsHooks/useJobs';
import JobItem from '../components/JobComponents/JobItem';
import Pagination from '../components/pagination';
import JobFilters from './JobFilters';
import JobForm from '../components/JobComponents/JobForm';

const JobsList: React.FC = () => {
  const {
    jobs,
    isLoading,
    currentPage,
    totalPages,
    filters,
    allTags,
    handleFilterChange,
    handleArchive,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDrop,
    handlePageChange,
    handleCreateJob,
    handleUpdateJob,
  } = useJobs();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleFormSubmit = (formData: Job | Omit<Job, 'id'>) => {
    if ('id' in formData) {
      handleUpdateJob(formData);
    } else {
      handleCreateJob(formData);
    }
    handleCloseModal();
  };

  const handleArchiveClick = (id: number, status: string) => {
    handleArchive(id, status as Job['status']);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-2">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5 mb-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Job Board
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all your active and archived job postings.
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 px-5 py-2.5"
          >
            <svg
              className="w-5 h-5 mr-2 -ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create New Job
          </button>
        </div>
      </div>

      {/* Filters */}
      <JobFilters
        filters={filters}
        allTags={allTags}
        onFilterChange={handleFilterChange}
      />

      {/* Job List */}
      <div className="mt-8">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            Loading jobs...
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="space-y-4">
              {jobs.map((job, idx) => (
                <JobItem
                  key={job.id}
                  job={job}
                  index={idx}
                  onArchive={handleArchiveClick}
                  onEdit={handleOpenEditModal}
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDrop}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              isLoading={isLoading}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center bg-white border-2 border-dashed rounded-lg p-12 text-gray-500 mt-10">
            <div className="mx-auto h-12 w-12 text-gray-400">
              {/* ... SVG Icon ... */}
            </div>
            <h3 className="mt-4 font-semibold text-lg text-gray-800">
              No Jobs Found
            </h3>
            <p className="mt-1">
              No jobs match the current filters.
            </p>
          </div>
        )}
      </div>

      <JobForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingJob}
        allTags={allTags}
      />
    </div>
  );
};

export default JobsList;