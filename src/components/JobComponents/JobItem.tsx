import React from 'react';
import { Link } from 'react-router-dom';

interface Job {
  id: number;
  title: string;
  status: 'active' | 'archived';
  tags: string[]; 
}

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
    // Pass both the id and the current status
    onArchive(job.id, job.status);
  };

  return (
    <div
      className="border rounded-lg p-4 shadow-md mb-4 cursor-move hover:shadow-lg transition-shadow"
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="flex justify-between items-start flex-wrap">
        <div className="flex-grow pr-4">
          <Link to={`/jobs/${job.id}`} className="no-underline">
            <h2
              className={`text-lg font-semibold truncate transition-opacity duration-500 text-gray-800 hover:text-blue-600 ${
                job.status === 'archived' ? 'opacity-50' : 'opacity-100'
              }`}
            >
              JOB Name: {job.title}
            </h2>
          </Link>
          
          <div className="mt-2">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div 
          className={`flex items-center gap-2 mt-2 md:mt-0 flex-shrink-0 transition-opacity duration-500 ${
            job.status === 'archived' ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <button
            onClick={handleEditClick} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Edit
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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