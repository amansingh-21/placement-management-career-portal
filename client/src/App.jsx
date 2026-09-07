import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Unauthorized from "./pages/auth/Unauthorized.jsx";
import StudentDashboard from "./pages/student/Dashboard.jsx";
import RecruiterDashboard from "./pages/recruiter/Dashboard.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import StudentProfile from "./pages/student/Profile.jsx";
import CompanyProfile from "./pages/recruiter/CompanyProfile.jsx";
import AdminCompanies from "./pages/admin/Companies.jsx";

import StudentJobs from "./pages/student/Jobs.jsx";
import StudentJobDetails from "./pages/student/JobDetails.jsx";

import ManageJobs from "./pages/recruiter/ManageJobs.jsx";
import CreateJob from "./pages/recruiter/CreateJob.jsx";
import EditJob from "./pages/recruiter/EditJob.jsx";

import AdminJobs from "./pages/admin/Jobs.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/company"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <CompanyProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/companies"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminCompanies />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/jobs"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/jobs/:id"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentJobDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/jobs"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <ManageJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/jobs/create"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <CreateJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/jobs/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <EditJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminJobs />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;