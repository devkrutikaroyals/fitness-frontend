import React, { useState, useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import Navbar from '../layout/Navbar'; // ✅ import Navbar
import './layout.css';

const MemberLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          ☰
        </button>

        <div className="nav-group">
          <Link to="/member/dashboard">
            <span className="icon">🏠</span>
            <span className="label">Dashboard</span>
          </Link>
          <Link to="/member/classes">
            <span className="icon">📚</span>
            <span className="label">Classes</span>
          </Link>
          <Link to="/member/workout-plans">
            <span className="icon">💪</span>
            <span className="label">Workout Plans</span>
          </Link>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">🚪</span>
          <span className="label">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className="main-section">
        <Navbar /> {/* ✅ Top Navbar */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
