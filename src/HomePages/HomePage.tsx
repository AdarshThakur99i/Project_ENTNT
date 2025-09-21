import React, { useState, useEffect } from 'react';
import { fetchJobs } from '../api/JobsApi/JobsApi';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [jobStats, setJobStats] = useState({
    activeJobs: 0,
    totalJobs: 0,
    loading: true
  });
  const navigate = useNavigate();

  const handleJobsClick = () => {
    console.log('Navigate to /jobs/jobsList');
    navigate('/jobs/jobsList');
  };

  useEffect(() => {
    const loadJobStats = async () => {
      try {
        setJobStats(prev => ({ ...prev, loading: true }));
        
        const activeJobsResponse = await fetchJobs({
          page: 1,
          pageSize: 100,
          status: 'active'
        });
        
        const allJobsResponse = await fetchJobs({
          page: 1,
          pageSize: 1
        });
        
        setJobStats({
          activeJobs: activeJobsResponse.data.length,
          totalJobs: allJobsResponse.totalCount,
          loading: false
        });
      } catch (error) {
        console.error('Failed to load job statistics:', error);
        setJobStats({
          activeJobs: 0,
          totalJobs: 0,
          loading: false
        });
      }
    };

    loadJobStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Job Management Center
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Manage your job postings, track applications, and streamline your hiring process
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Job Postings</p>
                {jobStats.loading ? (
                  <div className="animate-pulse mt-1">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{jobStats.activeJobs}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Job Listings</p>
                {jobStats.loading ? (
                  <div className="animate-pulse mt-1">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{jobStats.totalJobs.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleJobsClick}
              className="w-full bg-blue-600 text-white text-lg font-semibold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              View Jobs List
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              {jobStats.loading ? 'Loading job data...' : 'Manage all your job postings'}
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Create & Edit</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Easily create new job postings and edit existing ones with our intuitive interface</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Organize & Filter</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Sort, filter, and organize job listings by status, tags, and other criteria</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Track Performance</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Monitor job posting performance and application rates across all positions</p>
          </div>
        </div>
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © 2025 TalentFlow. Streamlining your hiring process.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;