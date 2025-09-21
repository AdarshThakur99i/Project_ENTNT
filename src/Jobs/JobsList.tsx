import React, { useState } from 'react';
import type { Job } from '@/data/JobsData/Jobs.types';
import { useJobs } from '../hooks/JobsHooks/useJobs';
import JobItem from '../components/JobComponents/JobItem';
import Pagination from '../components/pagination';
import JobFilters from './JobFilters';
import JobForm from '../components/JobComponents/JobForm';
import { Search,  Filter, Briefcase} from 'lucide-react';

const JobsList: React.FC = () => {
  const {
    jobs,
    isLoading,
    currentPage,
    totalPages,
    totalJobsCount,
    filters,
    allTags,
    sortBy,
    handleFilterChange,
    handleArchive,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDrop,
    handlePageChange,
    handleCreateJob,
    handleUpdateJob,
    handleSortChange,
  } = useJobs();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleFormSubmit = (formData: Job | Omit<Job, 'id'>) => {
    if ('id' in formData) {
      handleUpdateJob(formData as Job);
    } else {
      handleCreateJob(formData);
    }
    handleCloseModal();
  };

  const handleClearAllFilters = () => {
    // Reset all filters to their default state
    handleFilterChange('search', '');
    handleFilterChange('status', 'all');
    handleFilterChange('tags', []);
    handleFilterChange('jobType', []);
    handleFilterChange('experience', 'all');
  };

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'active').length,
    archived: jobs.filter(j => j.status === 'archived').length
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-600 dark:text-white mb-4">
            Manage your company jobs
          </h1>
      <p className="text-2xl font-semibold text-gray-800 dark:text-white mb-10 max-w-3xl mx-auto text-center">
            Track, edit and optimize your job postings. Monitor applications and manage your hiring pipeline.
          </p>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search job titles, departments, or skills..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </span>
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          {showFilters && (
            <div className="xl:w-96">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 mb-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-xl">Filters</h3>
                  <button 
                    onClick={handleClearAllFilters}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  <JobFilters
                    filters={filters}
                    allTags={allTags}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>

              {/* Stats Cards */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-8 text-xl">Job Statistics</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Total Jobs</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{totalJobsCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Active</span>
                      </div>
                      <span className="font-bold text-green-600 text-lg">{stats.active}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
   
                      </div>
                     
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Archived</span>
                      </div>
                      <span className="font-bold text-gray-600 text-lg">{stats.archived}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {totalJobsCount} job{totalJobsCount !== 1 ? 's' : ''} found
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Manage your company's job postings and applications
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort by:
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="ml-2 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="order">Default Order</option>
                      <option value="title">Title</option>
                      <option value="status">Status</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
               {jobs.map((job, idx) => (
  <div
    key={job.id}
    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <JobItem
      job={job}
      index={idx}
      onArchive={handleArchive}
      onEdit={handleOpenEditModal}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    />
  </div>
))}
                
                {/* Pagination */}
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isLoading={isLoading}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                <Briefcase className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  No jobs match your current filters. Try adjusting your search criteria or create your first job posting.
                </p>
                <button
                  onClick={handleOpenCreateModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Create Your First Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Form Modal */}
      <JobForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingJob}
        allTags={allTags}
      />

      {/* Dark mode toggle */}
      <button
        onClick={() => document.documentElement.classList.toggle('dark')}
        className="fixed bottom-6 right-6 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
        aria-label="Toggle dark mode"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path className="dark:hidden" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          <path className="hidden dark:inline" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>
    </div>
  );
};

export default JobsList;