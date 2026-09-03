import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <aside>
      <h3>Menu</h3>

      {user.role === "STUDENT" && (
        <nav>
          <NavLink to="/student/dashboard">
            Dashboard
          </NavLink>

          <NavLink to="/student/jobs">
            Jobs
          </NavLink>

          <NavLink to="/student/applications">
            Applications
          </NavLink>

          <NavLink to="/student/profile">
            Profile
          </NavLink>
        </nav>
      )}

      {user.role === "RECRUITER" && (
        <nav>
          <NavLink to="/recruiter/dashboard">
            Dashboard
          </NavLink>

          <NavLink to="/recruiter/jobs">
            Jobs
          </NavLink>

          <NavLink to="/recruiter/applications">
            Applications
          </NavLink>

          <NavLink to="/recruiter/profile">
            Profile
          </NavLink>
        </nav>
      )}

      {user.role === "ADMIN" && (
        <nav>
          <NavLink to="/admin/dashboard">
            Dashboard
          </NavLink>

          <NavLink to="/admin/users">
            Users
          </NavLink>

          <NavLink to="/admin/companies">
            Companies
          </NavLink>

          <NavLink to="/admin/jobs">
            Jobs
          </NavLink>
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;