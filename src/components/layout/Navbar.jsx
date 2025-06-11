import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import '../layout/Navbar.css'; // Make sure path is correct

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <h1 className="navbar-logo">🏋️‍♂️ FitZone</h1>
        </div>

        <div className="navbar-right">
          {isAuthenticated && (
            <>
              <span className="navbar-welcome">
                Welcome, <strong>{user?.name}</strong>
              </span>
              <button className="navbar-logout-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
