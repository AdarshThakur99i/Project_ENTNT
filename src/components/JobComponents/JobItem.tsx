import React from 'react';
import { Link } from 'react-router-dom';
import type { Job } from '../../data/JobsData/Jobs.types';

interface JobItemProps {
  job: Job;
  index: number;
  onArchive: (id: number, currentStatus: string) => void;
  onEdit: (job: Job) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

const JobItem: React.FC<JobItemProps> = ({
  job,
  index,
  onArchive,
  onEdit,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(job);
  };

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onArchive(job.id, job.status);
  };

  return (
    <div
      className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-move group ${job.status === 'archived' ? 'opacity-60 bg-gray-50' : ''}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex-grow">
          <Link to={`/jobs/${job.id}`} className="no-underline">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
              {job.title}
            </h2>
          </Link>
          <div className="mt-2 flex items-center flex-wrap gap-x-4 gap-y-2">
            <span className={`capitalize inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {job.status}
            </span>
            <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleEditClick}
            className="bg-gray-400 hover:bg-gray-200 text-gray-800 font-medium py-1 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
            Edit
          </button>
          <button
            className={`px-3 py-1.5 text-sm font-semibold text-white rounded-md transition-colors ${
              job.status === 'active'
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-gray-400 hover:bg-green-600'
            }`}
            onClick={handleArchiveClick}
          >
            {job.status === 'active' ? 'Archive' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobItem;

