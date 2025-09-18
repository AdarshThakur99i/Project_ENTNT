import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import * as jobLogic from '../hooks/JobsHooks/createOrUpdateJobsLogic'; 

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState(null);
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
  );
};

export default JobDetails;