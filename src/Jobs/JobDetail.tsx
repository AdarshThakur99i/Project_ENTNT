import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as jobLogic from '../hooks/JobsHooks/createOrUpdateJobsLogic';
import type { Job } from '../data/JobsData/JobsMockData';
const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
   const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      setIsLoading(true);
      const fetchedJob = await jobLogic.getJobById(parseInt(jobId));
      setJob(fetchedJob);
      setIsLoading(false);
    };
    fetchJob();
  }, [jobId]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading job details...</div>;
  }

  if (!job) {
    return <div className="p-8 text-center">Job not found.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/jobs/jobsList" className="text-blue-500 hover:underline mb-6 block">&larr; Back to all jobs</Link>
      
    
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h1 className="text-4xl font-bold">{job.title}</h1>
        <p className="text-lg text-gray-600 mt-2">Status: <span className="font-semibold">{job.status}</span></p>
        <div className="mt-4">
          {job.tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 text-gray-800 text-sm font-semibold mr-2 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

   
      <div>
        <h2 className="text-2xl font-semibold mb-4">Assessment</h2>
        <Link 
          to={`/jobs/${jobId}/assessment-builder`} 
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Assessment Builder</h3>
              <p className="text-gray-600">Create or edit the assessment for this job.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default JobDetails;