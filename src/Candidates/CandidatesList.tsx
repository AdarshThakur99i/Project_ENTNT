import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { useCandidates } from '../hooks/CandidatesHook/useCandidates';
import type { Candidate } from '../data/CandidatesFunctions/mockCandidates';

const getStageBadgeColor = (stage: Candidate['currentStage']) => {
    switch (stage) {
        case 'Hired':
            return 'bg-green-100 text-green-800';
        case 'Rejected':
            return 'bg-red-100 text-red-800';
        case 'Interview':
            return 'bg-indigo-100 text-indigo-800';
        case 'Screening':
            return 'bg-yellow-100 text-yellow-800';
        case 'Applied':
        default:
            return 'bg-blue-100 text-blue-800';
    }
};


const CandidatesList: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const numericJobId = jobId ? parseInt(jobId, 10) : undefined;

  const {
    isLoading,
    searchedCandidates,
    searchTerm,
    setSearchTerm,
    stageFilter,
    setStageFilter,
  } = useCandidates(numericJobId);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (!searchedCandidates) return null;
    const candidate = searchedCandidates[index];

    return (
      <div style={style} className="px-2 py-1">
        <Link to={`/jobs/${jobId}/candidates/${candidate.id}`} className="block no-underline text-current h-full">
          <div className="flex items-center border-b p-4 h-full hover:bg-gray-50 transition-colors rounded-md">
            <div className="flex-grow">
              <div className="font-bold text-lg text-gray-800">{candidate.name}</div>
              <div className="text-sm text-gray-600">{candidate.email}</div>
            </div>
            <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStageBadgeColor(candidate.currentStage)}`}>
              {candidate.currentStage}
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="border-b border-gray-200 pb-5 mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Candidate Pipeline</h1>
                <p className="text-gray-600 mt-1">Track and manage candidates for this job.</p>
              </div>
              <Link to={`/jobs/${jobId}/candidates/kanbanview`} className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all text-sm">
                <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                Kanban View
              </Link>
          </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <select
          value={stageFilter || 'all'}
          onChange={(e) => setStageFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm min-w-[180px] focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Stages</option>
          <option value="Applied">Applied</option>
          <option value="Screening">Screening</option>
          <option value="Interview">Interview</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="border rounded-lg shadow-sm h-[70vh] bg-white overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading candidates...</div>
        ) : searchedCandidates && searchedCandidates.length > 0 ? (
          <List
            height={window.innerHeight * 0.7}
            itemCount={searchedCandidates.length}
            itemSize={80}
            width="100%"
          >
            {Row}
          </List>
        ) : (
          <div className="text-center bg-white border-2 border-dashed rounded-lg p-12 text-gray-500 h-full flex flex-col justify-center items-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1-3.796V12a4 4 0 11-8 0v2.121" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-800">No Candidates Found</h3>
              <p className="mt-1">No candidates match the current filters. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesList;

