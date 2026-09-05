import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <div>
        <h2>Placement Portal</h2>
      </div>

      <div>
        {user && (
          <span>
            Welcome, {user.name}
          </span>
        )}

        {user?.role === "RECRUITER" && (
          <button
            onClick={() => navigate("/recruiter/company")}
          >
            Company Profile
          </button>
        )}

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;