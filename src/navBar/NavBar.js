import React, { useContext } from 'react';
import {Link, useHistory } from 'react-router-dom';
import { UserContext } from '../context/UserContext.js';
const NavBar = () => {
    const { user, logout } = useContext(UserContext);
    const history = useHistory();
  
    const handleLogout = () => {
      logout();
      history.push('/login');
    };
  
    return (
      <nav>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/profiles">Profiles</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    );
}

export default NavBar