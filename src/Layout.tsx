import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-1">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
             
              
              <div className="border-l border-gray-200 pl-4 ml-2">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Home
                  </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
             
               <span className="text-sm text-gray-500 hidden sm:block">Welcome, HR Team</span>
               <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>
      <main className='pt-6 mb-8' >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

