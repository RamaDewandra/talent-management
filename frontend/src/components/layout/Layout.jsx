import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

export function Layout({ children }) {
  const { user, logout, isHR, isManager } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/dashboard">Talent Management</Link>
        </div>
        <div className="navbar-menu">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          
          {(isHR() || isManager()) && (
            <Link 
              to="/assessments" 
              className={`nav-link ${isActive('/assessments') ? 'active' : ''}`}
            >
              Assessments
            </Link>
          )}
          
          {isHR() && (
            <>
              <Link 
                to="/periods" 
                className={`nav-link ${isActive('/periods') ? 'active' : ''}`}
              >
                Periods
              </Link>
              <Link 
                to="/indicators" 
                className={`nav-link ${isActive('/indicators') ? 'active' : ''}`}
              >
                Indicators
              </Link>
            </>
          )}
        </div>
        <div className="navbar-user">
          <span className="user-info">
            {user?.name} ({user?.role?.name})
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
