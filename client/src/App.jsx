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

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;