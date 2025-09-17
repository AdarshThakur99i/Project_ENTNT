import React from 'react';


interface Job {
  id: number;
  title: string;
  status: 'active' | 'archived';
  tags: string[]; 
}

interface JobItemProps {
  job: Job;
  index: number;
  onArchive: (id: number) => void;
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
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  return (
    <div
      className="border rounded-lg p-4 shadow-md mb-4 cursor-move"
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="flex justify-between items-start flex-wrap">
      
        <div className="flex-grow pr-4">
          <h2
            className={`text-lg font-semibold truncate transition-opacity duration-500 ${
              job.status === 'archived' ? 'opacity-50' : 'opacity-100'
            }`}
          >
            JOB Name: {job.title}
          </h2>
          
        
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

       
        <button
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2 md:mt-0 flex-shrink-0 ${
              job.status === 'archived' ? 'opacity-50' : 'opacity-100'
            }`}
          onClick={() => onArchive(job.id)}
        >
          {job.status === 'active' ? 'Archive' : 'Activate'}
        </button>
      </div>
    </div>
  );
};

export default JobItem;