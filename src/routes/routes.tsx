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
      <Route path="/" element={<JobPage />} />
      <Route path="/candidates" element={<CandidatePage />} />

      <Route path="/jobs/jobsList" element={<JobsList />} />
      
      <Route path="/jobs/:jobId/assessment-builder" element={<AssessmentBuilder />} />
      <Route path="/jobs/:jobId/assessment-preview" element={<AssessmentPreview />} />
      
      <Route path="/jobs/:jobId/candidates" element={<CandidatesList />} />
      
      <Route path="/jobs/:jobId" element={<JobDetail />} />
      <Route path="/jobs/:jobId/candidates/kanbanview" element={<KanbanBoard />} />
      <Route path="/jobs/:jobId/candidates/:candidateId" element={<CandidateProfile />} />
    </Routes>
  );
}

export default AppRoutes;
