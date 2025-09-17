import { useState } from 'react'

import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JobPage from './HomePages/JobPage';
import JobsList from './Jobs/JobsList';

function App() {
  

  return (
    <>
       <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
        Tailwind Test Button
      </button>
      <Router>
      <Routes>
        <Route path="/jobs" element={<JobPage />} />
        <Route path="/jobs/jobsList" element={<JobsList />} />
      </Routes>
    </Router>

    </>
  )
}

export default App
