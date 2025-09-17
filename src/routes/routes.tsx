
import { Routes, Route } from "react-router-dom";
import JobPage from '../HomePages/JobPage';
import JobsList from '../Jobs/JobsList';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/jobs" element={<JobPage />} />
      <Route path="/jobs/jobsList" element={<JobsList />} />
    </Routes>
  );
}

export default AppRoutes;
