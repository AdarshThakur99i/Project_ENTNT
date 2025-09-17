import { useState } from 'react'

import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JobPage from './HomePages/JobPage';
import JobsList from './Jobs/JobsList';
import AppRoutes from './routes/routes';

function App() {
  

  return (
    <>
     
      <Router>
      <AppRoutes/>
    </Router>

    </>
  )
}

export default App
