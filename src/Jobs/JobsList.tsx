import React, { useState } from 'react';
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
  const [editingJob, setEditingJob] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job: any) => {
    console.log("Setting job for editing:", job);
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleFormSubmit = (formData: any) => {
    if (formData.id) {
      console.log("UPDATING JOB:", formData);
      handleUpdateJob(formData);
    } else {
      console.log("CREATING JOB:", formData);
      handleCreateJob(formData);
    }
  };

  return (
    <div className="p-4 text-left max-w-4xl mx-auto">
      
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Job Board</h1>
        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 shadow-sm transition-colors"
        >
          + Create New Job
        </button>
      </div>
      
      <JobFilters 
        filters={filters}
        allTags={allTags}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="text-center p-10">Loading jobs...</div>
      ) : jobs.length > 0 ? (
        <>
          {jobs.map((job, index) => (
            <JobItem
              key={job.id}
              job={job}
              index={index}
              onArchive={handleArchive}
              onEdit={handleOpenEditModal}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDrop}
            />
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center p-10 text-gray-500">No jobs match the current filters.</div>
      )}
      
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