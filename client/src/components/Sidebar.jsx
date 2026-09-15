import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <rect x="1.5" y="1.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    <rect x="9.5" y="1.5" width="6" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    <rect x="1.5" y="9.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    <rect x="9.5" y="12.5" width="6" height="3" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const JobsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <rect x="1.5" y="5" width="14" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5.5 5V3.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5V5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1.5 9.5H15.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const ApplicationsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M3.5 1.5H9L13.5 6V15.5H3.5V1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M6 8.5H11M6 11.5H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const InterviewIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <rect x="1.5" y="3" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1.5 6.5H15.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5 1.5V4.5M12 1.5V4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <circle cx="8.5" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2.5 15c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const CompanyIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <rect x="2" y="2" width="8" height="13" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <rect x="10" y="6" width="5" height="9" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <path d="M4.5 5H7.5M4.5 8H7.5M4.5 11H7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path
      d="M4 7a4.5 4.5 0 0 1 9 0c0 3.5 1.2 4.5 1.2 4.5H2.8S4 10.5 4 7Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path d="M7 14a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const NAV_ITEMS = {
  STUDENT: [
    { to: "/student/dashboard", label: "Dashboard", icon: DashboardIcon },
    { to: "/student/jobs", label: "Jobs", icon: JobsIcon },
    { to: "/student/applications", label: "Applications", icon: ApplicationsIcon },
    { to: "/student/interviews", label: "Interviews", icon: InterviewIcon },
    { to: "/student/notifications", label: "Notifications", icon: BellIcon },
    { to: "/student/profile", label: "Profile", icon: ProfileIcon },
  ],
  RECRUITER: [
    { to: "/recruiter/dashboard", label: "Dashboard", icon: DashboardIcon },
    { to: "/recruiter/jobs", label: "Manage Jobs", icon: JobsIcon },
    { to: "/recruiter/applicants", label: "Applicants", icon: ApplicationsIcon },
    { to: "/recruiter/interviews", label: "Interviews", icon: InterviewIcon },
    { to: "/recruiter/company", label: "Company Profile", icon: CompanyIcon },
  ],
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard", icon: DashboardIcon },
    { to: "/admin/companies", label: "Companies", icon: CompanyIcon },
    { to: "/admin/jobs", label: "Jobs", icon: JobsIcon },
  ],
};

const Sidebar = ({ isOpen = false, onNavigate }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const items = NAV_ITEMS[user.role] || [];

  return (
    <aside className={`app-sidebar${isOpen ? " is-open" : ""}`}>
      <p className="app-sidebar-label">Menu</p>

      <nav className="app-sidebar-nav">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `app-sidebar-link${isActive ? " active" : ""}`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;