import React, { useState, useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Ensure correct path
import { AuthContext } from '../../context/authContext'; // Adjust if needed
import './layout.css';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          ☰
        </button>
        <nav className="nav-group">
          <Link to="/admin/dashboard">
            <span className="icon">📊</span>
            <span className="label">Dashboard</span>
          </Link>
          <Link to="/admin/classes">
            <span className="icon">📚</span>
            <span className="label">Classes</span>
          </Link>
          <Link to="/admin/members">
            <span className="icon">👥</span>
            <span className="label">Members</span>
          </Link>
          <Link to="/admin/workout-plans">
            <span className="icon">💪</span>
            <span className="label">Workout Plans</span>
          </Link>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">🚪</span>
          <span className="label">Logout</span>
        </button>
      </aside>

      <div className="main-section">
        <Navbar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
