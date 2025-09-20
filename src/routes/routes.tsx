import { Routes, Route } from "react-router-dom";
import JobPage from '../HomePages/JobPage';
import JobsList from '../Jobs/JobsList';
import JobDetail from "../Jobs/JobDetail";
import CandidatesList from "../Candidates/CandidatesList";
import CandidatePage from "../HomePages/CandidatePage";
import KanbanBoard from "../Candidates/KanbanBoard";
import CandidateProfile from "../Candidates/CandidateProfile";
import AssessmentBuilder from "../Assessments/AssessmentBuilder";
import AssessmentPreview from "../components/AssessmentComponents/AssessmentPreview";
function AppRoutes() {
  return (
     <Routes>
      {/* --- Page Routes --- */}
      <Route path="/jobs" element={<JobPage />} />
      <Route path="/candidates" element={<CandidatePage />} />

      {/* --- Job Specific Routes (Most specific first) --- */}
      <Route path="/jobs/jobsList" element={<JobsList />} />
      
      {/* --- THIS IS THE FIX --- */}
      {/* The routes with more segments (/assessment-builder, /assessment-preview) must come BEFORE the general /:jobId route. */}
      <Route path="/jobs/:jobId/assessment-builder" element={<AssessmentBuilder />} />
      <Route path="/jobs/:jobId/assessment-preview" element={<AssessmentPreview />} />
      <Route path="/jobs/:jobId" element={<JobDetail />} /> {/* General route now last */}

      {/* --- Candidate Specific Routes (Most specific first) --- */}
      <Route path="/candidates/candidatesList" element={<CandidatesList />} />
      <Route path="/candidates/kanbanview" element={<KanbanBoard />} />
      <Route path="/candidates/:candidateId" element={<CandidateProfile />} />
    </Routes>
    
  );
}

export default AppRoutes;
