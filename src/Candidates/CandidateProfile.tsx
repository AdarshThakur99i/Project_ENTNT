import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as candidateService from '../data/CandidatesData/CandidateFunctions';
import type { Candidate } from '../data/CandidatesData/mockCandidates';

const CandidateProfile: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandidateData = async () => {
      if (!candidateId) return;
      setIsLoading(true);
      const data = await candidateService.getCandidateById(parseInt(candidateId));
      setCandidate(data);
      setIsLoading(false);
    };
    fetchCandidateData();
  }, [candidateId]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading candidate...</div>;
  }

  if (!candidate) {
    return <div className="p-8 text-center">Candidate not found.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/candidates/candidatesList" className="text-blue-500 hover:underline mb-6 block">&larr; Back to List</Link>
      
      <div>
        <h1 className="text-4xl font-bold">{candidate.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{candidate.email}</p>
        <p className="mt-2">Current Stage: <span className="font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-md">{candidate.currentStage}</span></p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-8 border-b pb-2">Timeline</h2>
        
        <div className="relative">
          
          <div className="absolute left-0 top-2 h-1 w-full bg-blue-200"></div>
          
        
          <div className="relative flex justify-between">
            {candidate.stageHistory.map((entry, index) => (
              <div key={index} className="flex flex-col items-center text-center w-40">
                
                <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white z-10"></div>
                
              
                <p className="font-bold text-lg mt-2">{entry.stage}</p>
                
              
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(entry.timestamp).toLocaleString('en-IN', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;