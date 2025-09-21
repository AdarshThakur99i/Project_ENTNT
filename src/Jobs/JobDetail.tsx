import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as jobsApi from '../api/JobsApi/JobsApi';
import type { Job } from '@/data/JobsData/Jobs.types';

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
  <div className="max-w-4xl mx-auto px-6 py-12 text-gray-900 dark:text-white transition-colors">
    {/* Back Link */}
    <div className="mb-6">
      <Link
        to="/jobs/jobsList"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to All Jobs
      </Link>
    </div>

    {/* Job Header */}
    <div className="border-b border-gray-200 dark:border-gray-700 pb-5 mb-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
            {job.title}
          </h1>
          <div className="mt-2 flex items-center gap-4">
            <span
              className={`capitalize inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${job.status === 'active'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                  : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'}
              `}
            >
              {job.status}
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {job.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs text-gray-600 dark:text-gray-400 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Action Cards */}
    <div className="grid md:grid-cols-2 gap-6">
      {/* Candidates Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow group">
        <h2 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">
          Candidates
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          View and manage the candidates who have applied for this role.
        </p>
        <Link
          to={`/jobs/${jobId}/candidates`}
          className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:underline"
        >
          View Candidates &rarr;
        </Link>
      </div>

      {/* Assessments Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow group">
        <h2 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">
          Assessments
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          Manage skills assessments for this role.
        </p>
        <Link
          to={`/jobs/${jobId}/assessment-builder`}
          className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:underline"
        >
          Manage Assessments &rarr;
        </Link>
      </div>
    </div>

    {/* Danger Zone */}
    <div className="mt-16 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
        Danger Zone
      </h3>
      <div className="mt-2 flex justify-between items-center bg-red-50 dark:bg-red-900 p-4 rounded-lg">
        <p className="text-sm text-red-800 dark:text-red-300">
          Permanently delete this job and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          Delete Job
        </button>
      </div>
    </div>
  </div>

  );
};

export default JobDetails;

