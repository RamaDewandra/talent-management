import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const NavLink = ({ to, icon, label, exact = false }) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </Link>
  );
};

export function Layout({ children }) {
  const { user, logout, isHR, isManager } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) =>
    name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';

  return (
    <div className="layout">
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <Link to="/dashboard">
            <span className="brand-icon">⬡</span>
            <span className="brand-text">TalentHub</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="sidebar-menu">
          <NavLink to="/dashboard" exact icon="📊" label="Dashboard" />

          {(isHR() || isManager()) && (
            <>
              <NavLink to="/analytics" icon="📈" label="Analytics" />
              <NavLink to="/employees" icon="👥" label="Employees" />
              <NavLink to="/assessments" icon="📝" label="Assessments" />
              <NavLink to="/reports" icon="🖨️" label="Reports" />
            </>
          )}

          {isHR() && (
            <>
              <div className="nav-section-label">HR Settings</div>
              <NavLink to="/manage/users" icon="👥" label="Manage Users" />
              <NavLink to="/calendar" icon="📆" label="Calendar" />
              <NavLink to="/periods" icon="📅" label="Periods" />
              <NavLink to="/indicators" icon="⚙️" label="Indicators" />
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <div className="user-avatar">{getInitials(user?.name)}</div>
          <div className="user-info-block">
            <span className="user-name">{user?.name}</span>
            <span className="user-role-badge">{user?.role?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="logout-btn"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
