import React from 'react';
import { Link, Outlet, useOutletContext } from 'react-router-dom';
import { Plus } from 'lucide-react';
import JobForm from './components/JobComponents/JobForm';
import { createJob, fetchTags, updateJob } from './api/JobsApi/JobsApi';
import type { Job } from '@/data/JobsData/Jobs.types'; 

type AppContextType = {
  setJobListRefresher: React.Dispatch<React.SetStateAction<(() => void) | null>>;
  handleOpenEditModal: (job: Job) => void;
};

export function useAppOutletContext() {
  return useOutletContext<AppContextType>();
}

const Layout: React.FC = () => {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'dark');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingJob, setEditingJob] = React.useState<Job | null>(null);
  const [allTags, setAllTags] = React.useState<string[]>([]);
  
  const [jobListRefresher, setJobListRefresher] = React.useState<(() => void) | null>(null);

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  React.useEffect(() => {
    fetchTags().then(setAllTags).catch(console.error);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

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

  const handleFormSubmit = async (formData: Job | Omit<Job, 'id'>) => {
    try {
      if ('id' in formData) {
        // We cast here to assure TypeScript that formData is a complete Job object
        await updateJob(formData.id, formData as Job);
      } else {
        await createJob(formData);
      }
      handleCloseModal();
      if (jobListRefresher) {
        jobListRefresher();
      }
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <header className="bg-neutral-50 dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="h-8 flex items-center border-l border-gray-200 dark:border-gray-600 pl-4">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Job
                </button>
              <span className="text-sm text-gray-500 dark:text-gray-300 hidden sm:block">Welcome, HR Team</span>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  {theme === 'dark' ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg> : 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.706-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 10.607a1 1 0 011.414 0l.707-.707a1 1 0 11-1.414-1.414l-.707.707a1 1 0 010 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" /></svg>
                  }
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-neutral-50">
        <Outlet context={{ setJobListRefresher, handleOpenEditModal }} />
      </main>

      <JobForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingJob}
        allTags={allTags}
      />
    </div>
  );
};

export default Layout;