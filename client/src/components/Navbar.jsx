import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import NotificationBell from "./NotificationBell.jsx";

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M2.25 4.5H15.75M2.25 9H15.75M2.25 13.5H15.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const getInitials = (name) => {
  if (!name) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const Navbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="app-navbar">
      <div className="app-navbar-left">
        {onMenuToggle && (
          <button
            type="button"
            className="app-menu-toggle"
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
          >
            <MenuIcon />
          </button>
        )}

        <span className="app-navbar-brand">
          Placement<span>Portal</span>
        </span>
      </div>

      <div className="app-navbar-right">
        {user?.role === "STUDENT" && <NotificationBell />}

        {user && (
          <div className="app-navbar-user">
            <span className="avatar">{getInitials(user.name)}</span>
            <span>
              <strong>{user.name}</strong>
            </span>
          </div>
        )}

        <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;