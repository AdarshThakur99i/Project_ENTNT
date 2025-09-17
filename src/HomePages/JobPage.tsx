import React from 'react';
import { useNavigate } from 'react-router-dom';

const JobPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate('/jobs/jobsList');
  };

  return (
    <div className="p-8">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleClick}
      >
        JOB LIST
      </button>
    </div>
  );
};

export default JobPage;
