import { Routes, Route } from "react-router-dom";

import HomePage from '../HomePages/HomePage';
import JobsList from '../Jobs/JobsList';
import JobDetail from "../Jobs/JobDetail";
import CandidatesList from "../Candidates/CandidatesList";
import KanbanBoard from "../Candidates/KanbanBoard";
import CandidateProfile from "../Candidates/CandidateProfile";
import AssessmentBuilder from "../Assessments/AssessmentBuilder";
import AssessmentPreview from "../components/AssessmentComponents/AssessmentPreview";
import NotFoundPage from "../components/NotFoundPage";

function AppRoutes() {
  return (
    <Routes>
    
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs/jobsList" element={<JobsList />} />
      
      <Route path="/jobs/:jobId/assessment-builder" element={<AssessmentBuilder />} />
      <Route path="/jobs/:jobId/assessment-preview" element={<AssessmentPreview />} />
      
      <Route path="/jobs/:jobId/candidates" element={<CandidatesList />} />
      <Route path="/jobs/:jobId/candidates/kanban" element={<KanbanBoard />} /> 
      <Route path="/jobs/:jobId/candidates/:candidateId" element={<CandidateProfile />} />
      
      <Route path="/jobs/:jobId" element={<JobDetail />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;

