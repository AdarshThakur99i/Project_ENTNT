import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as jobsApi from '../api/JobsApi/JobsApi';
import type { Job } from '../data/JobsData/Jobs.types';

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      setIsLoading(true);
      try {
        const fetchedJob = await jobsApi.fetchJobById(parseInt(jobId));
        setJob(fetchedJob);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleDelete = async () => {
    if (!jobId) return;
    const isConfirmed = window.confirm("Are you sure you want to delete this job? This action cannot be undone.");
    if (isConfirmed) {
      try {
        await jobsApi.deleteJob(parseInt(jobId));
        alert("Job deleted successfully.");
        navigate('/jobs/jobsList');
      } catch (error) {
        console.error("Failed to delete job:", error);
        alert("Error: Could not delete the job.");
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading job details...</div>;
  }

  if (!job) {
    return <div className="p-8 text-center text-red-500">Job not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* --- THIS IS THE FIX --- */}
      {/* A "Back to All Jobs" link is now present for consistent navigation. */}
      <div className="mb-6">
          <Link to="/jobs/jobsList" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors">
              <svg xmlns="http://www.w.3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to All Jobs
          </Link>
      </div>

      <div className="border-b border-gray-200 pb-5 mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{job.title}</h1>
                <div className="mt-2 flex items-center gap-4">
                    <span className={`capitalize inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {job.status}
                    </span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {job.tags.map(tag => (
                            <span key={tag} className="text-xs text-gray-600 font-medium">{tag}</span>
                        ))}
                    </div>
                </div>
              </div>
          </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1 text-gray-800">Candidates</h2>
              <p className="text-gray-600 mb-4 text-sm">View and manage the candidates who have applied for this role.</p>
              <Link to={`/jobs/${jobId}/candidates`} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors group-hover:underline">
                View Candidates &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1 text-gray-800">Assessments</h2>
              <p className="text-gray-600 mb-4 text-sm">Manage skills assessments for this role.</p>
              <Link to={`/jobs/${jobId}/assessment-builder`} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors group-hover:underline">
                Manage Assessments &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
        <div className="mt-2 flex justify-between items-center bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-800">Permanently delete this job and all associated data. This action cannot be undone.</p>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Delete Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

