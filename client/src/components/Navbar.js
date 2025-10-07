import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    // Force a re-render to update the navbar
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          CourtSide
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          {token && (
            <li className="nav-item">
              <Link to="/reservations" className="nav-links">
                Reservations
              </Link>
            </li>
          )}
          {token && (
             <li className="nav-item">
             <Link to="/admin" className="nav-links">
               Admin
             </Link>
           </li>
          )}
          <li className="nav-item">
            {token ? (
              <button onClick={handleLogout} className="nav-links-button">
                Logout
              </button>
            ) : (
              <Link to="/signin" className="nav-links">
                Sign In
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;