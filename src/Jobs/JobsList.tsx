import React from 'react';
import { useJobs } from '../hooks/useJobs';
import JobItem from '../components/jobItem';
import Pagination from '../components/pagination';

const JobsList: React.FC = () => {
  const {
    jobs, isLoading, currentPage, totalPages,
    handleArchive, handleDragStart, handleDragEnter,
    handleDragOver, handleDrop, handlePageChange,
  } = useJobs();

  return (
    <div className="p-4 text-left max-w-4xl mx-auto">
      {isLoading ? (
        <div className="text-center p-10">Loading jobs...</div>
      ) : (
        <>
          {jobs.map((job, index) => (
            <JobItem
              key={job.id} job={job} index={index}
              onArchive={handleArchive} onDragStart={handleDragStart}
              onDragEnter={handleDragEnter} onDragOver={handleDragOver}
              onDrop={handleDrop} onDragEnd={handleDrop}
            />
          ))}
          <Pagination
            currentPage={currentPage} totalPages={totalPages}
            isLoading={isLoading} onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default JobsList;