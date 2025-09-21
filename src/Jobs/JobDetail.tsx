import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as jobsApi from '../api/JobsApi/JobsApi';
import type { Job } from '@/data/JobsData/Jobs.types';
import { Briefcase, MapPin, Calendar, ArrowLeft, Users, FileText, Trash2, AlertTriangle } from 'lucide-react';

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      setIsLoading(true);
      try {
        const numericJobId = parseInt(jobId, 10);
        const fetchedJob = await jobsApi.fetchJobById(numericJobId);
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
    try {
      await jobsApi.deleteJob(parseInt(jobId));
      // Consider a more robust notification system than alert
      navigate('/jobs/jobsList'); 
    } catch (error) {
      console.error("Failed to delete job:", error);
      // Handle deletion error state in UI
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading job details...</div>;
  }

  if (!job) {
    return <div className="p-8 text-center text-red-500 dark:text-red-400">Job not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-900 dark:text-white transition-colors">
      <div className="mb-6">
        <Link to="/jobs/jobsList" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft size={16} /> Back to All Jobs
        </Link>
      </div>

      {/* Job Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-5 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white tracking-tight">{job.title}</h1>
        <div className="mt-3 flex items-center flex-wrap gap-x-4 gap-y-2 text-gray-600 dark:text-gray-400">
            <span className="flex items-center"><Briefcase size={14} className="mr-1.5" />{job.company}</span>
            <span className="flex items-center"><MapPin size={14} className="mr-1.5" />{job.location}</span>
            <span className="flex items-center"><Calendar size={14} className="mr-1.5" />Posted on {new Date(job.postedDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Job Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Salary Range</p>
            {/* ✅ FIX: Safely access salary with optional chaining and provide a fallback */}
            <p className="font-bold text-lg text-gray-800 dark:text-gray-200">
                {job.salary ? `$${Math.round(job.salary.min/1000)}k - $${Math.round(job.salary.max/1000)}k` : 'N/A'}
            </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Job Type</p>
            <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{job.jobType}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
            {/* ✅ FIX: Safely access experience and provide a fallback */}
            <p className="font-bold text-lg text-gray-800 dark:text-gray-200">
                {job.experience ? `${job.experience.min}-${job.experience.max} years` : 'N/A'}
            </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="font-bold text-lg text-gray-800 dark:text-gray-200 capitalize">{job.status}</p>
        </div>
      </div>
      
      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow group">
          <h2 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white flex items-center"><Users size={20} className="mr-2 text-blue-500" />Candidates</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">View and manage candidates for this role.</p>
          <Link to={`/jobs/${jobId}/candidates`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">View Pipeline &rarr;</Link>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow group">
          <h2 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white flex items-center"><FileText size={20} className="mr-2 text-purple-500" />Assessments</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Manage skills assessments for this role.</p>
          <Link to={`/jobs/${jobId}/assessment-builder`} className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">Manage Assessments &rarr;</Link>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-16 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Danger Zone</h3>
        {!showDeleteConfirm ? (
            <div className="mt-2 flex justify-between items-center bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-300">Permanently delete this job and all associated data.</p>
                <button onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg">
                    <Trash2 size={16} className="mr-2"/> Delete Job
                </button>
            </div>
        ) : (
            <div className="mt-2 bg-red-50 dark:bg-red-900/50 p-4 rounded-lg border border-red-200 dark:border-red-700">
                <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                    <div>
                        <h4 className="font-bold text-red-800 dark:text-red-200">Confirm Deletion</h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">Are you sure? This action cannot be undone.</p>
                        <div className="mt-4 flex gap-3">
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg">
                                Yes, delete job
                            </button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-sm font-semibold rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;

