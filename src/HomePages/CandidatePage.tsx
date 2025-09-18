import React from 'react'
import { useNavigate } from 'react-router-dom';

const CandidatePage = () => {
    const navigate=useNavigate();
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        navigate('/candidates/candidatesList');
      };
  return (
    <div>
        <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleClick}
      >
        Candidates List
      </button>
    </div>
  )
}

export default CandidatePage
