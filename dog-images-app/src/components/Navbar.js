
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul className="nav-links-left">
        <li className="nav-item app-name">
          <NavLink to="/" className="nav-link">
            HTTPPaw
          </NavLink>
        </li>
      </ul>
      <ul className="nav-links-right">
        {user ? (
          <>
            <li className="nav-item">
              <NavLink
                to="/search"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Search
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/lists"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Lists
              </NavLink>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-button">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Signup
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
