import React from 'react';
import { Link } from 'react-router-dom';
import { FixedSizeList } from 'react-window';

import { useCandidates } from '../hooks/CandidatesHook/useCandidates';
import type { Candidate } from '../data/CandidatesData/mockCandidates';


const CandidatesList: React.FC = () => {
  const { 
    isLoading, 
    searchedCandidates,
    searchTerm,
    setSearchTerm,
    stageFilter,
    setStageFilter,
  } = useCandidates();
  
  // the Row component is what react-window renders for each item.

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const candidate = searchedCandidates[index];
    return (
      <Link to={`/candidates/${candidate.id}`} style={style} className="block no-underline text-current">
        <div className="flex items-center border-b p-4 h-full hover:bg-gray-50 transition-colors">
          <div className="flex-grow">
            <div className="font-bold text-lg text-gray-800">{candidate.name}</div>
            <div className="text-sm text-gray-600">{candidate.email}</div>
          </div>
          <div className="text-sm font-medium px-2 py-1 bg-gray-200 text-gray-700 rounded">
            {candidate.currentStage}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">

    

      <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Candidates</h1>
      
        <Link to="/candidates/kanbanview" className="px-4 py-2 bg-black-500 text-white rounded-md hover:bg-black-600">
          Go to Kanban Board
        </Link>
      </div></div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-full"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="p-2 border rounded-md min-w-[150px]"
        >
          <option value="all">All Stages</option>
          <option value="Applied">Applied</option>
          <option value="Screening">Screening</option>
          <option value="Interview">Interview</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="border rounded-lg shadow-md h-[70vh] bg-white">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading candidates...</div>
        ) : (
          <FixedSizeList 
            height={window.innerHeight * 0.7} 
            itemCount={searchedCandidates.length}
            itemSize={80} 
            width="100%"
          >
            {Row}
          </FixedSizeList>
        )}
      </div>
    </div>
  );
};

export default CandidatesList;