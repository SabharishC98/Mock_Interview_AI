import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">◈</span>
          <span className="brand-text">InterviewAI</span>
        </Link>

        {user && (
          <div className="navbar-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Dashboard</Link>
            <Link to="/setup" className={`nav-link ${isActive('/setup') ? 'active' : ''}`}>New Interview</Link>
            <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>History</Link>
          </div>
        )}

        {user && (
          <div className="navbar-user">
            <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
            <span className="user-name">{user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Sign out</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;