
import { Routes, Route } from "react-router-dom";
import JobPage from '../HomePages/JobPage';
import JobsList from '../Jobs/JobsList';
import JobDetail from "../Jobs/JobDetail";
import CandidatesList from "../Candidates/CandidatesList";
import CandidatePage from "../HomePages/CandidatePage";
import KanbanBoard from "../Candidates/KanbanBoard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/jobs" element={<JobPage />} />
      <Route path="/jobs/jobsList" element={<JobsList />} />
      <Route path="/jobs/:jobId" element={<JobDetail />} />
      <Route path="/candidates" element={<CandidatePage />}/>
        <Route path="/candidates/candidatesList" element={<CandidatesList />}/>
         <Route path="/candidates/kanbanview" element={<KanbanBoard />}/>
          </Routes>
    
  );
}

export default AppRoutes;
