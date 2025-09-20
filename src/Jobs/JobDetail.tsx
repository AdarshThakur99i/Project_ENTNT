import { useState, useEffect } from 'react';
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

    // Use a custom modal in a real app instead of window.confirm
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
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/jobs/jobsList" className="text-blue-500 hover:underline mb-6 block">&larr; Back to all jobs</Link>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h1 className="text-4xl font-bold">{job.title}</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Candidates</h2>
        <div className="block p-6 bg-white border rounded-lg">
          <p className="text-gray-600 mb-4">View and manage the candidates who have applied for this role.</p>
          <div className="flex items-center gap-4">
            <Link
              to={`/jobs/${jobId}/candidates`}
              className="px-4 py-2 bg-black-500 text-white font-semibold rounded-lg hover:bg-black-600 transition-colors"
            >
              View Candidates
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Assessment</h2>
        <div className="block p-6 bg-white border rounded-lg">
          <p className="text-gray-600 mb-4">Manage or preview the skills assessment for this role.</p>
          <div className="flex items-center gap-4">
            <Link
              to={`/jobs/${jobId}/assessment-builder`}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Edit Assessment
            </Link>
            <Link
              to={`/jobs/${jobId}/assessment-preview`}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Preview
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-12 p-4 border-t border-dashed border-red-300">
        <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm text-gray-600">Permanently delete this job and all associated data.</p>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
