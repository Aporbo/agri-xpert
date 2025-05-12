import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpeg';  // Add logo image in your assets folder

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const activeLinkClass = 'text-green-300 hover:text-white';

  return (
    <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/">
        <img src={logo} alt="Agri Expert Logo" className="h-10" />
      </Link>
      <div className="space-x-4 flex items-center">
        <Link to="/" className={location.pathname === '/' ? activeLinkClass : ''}>Home</Link>

        {user?.role === 'FARMER' && (
          <>
            <Link to="/farmer" className={location.pathname === '/farmer' ? activeLinkClass : ''}>Dashboard</Link>
            <Link to="/farmer/history" className={location.pathname === '/farmer/history' ? activeLinkClass : ''}>History</Link>
          </>
        )}

        {user?.role === 'ADMIN' && (
          <Link to="/admin/dashboard" className={location.pathname === '/admin/dashboard' ? activeLinkClass : ''}>Dashboard</Link>
        )}

        {user ? (
          <>
            <div className="relative">
              <button onClick={toggleDropdown} className="font-semibold">{user.name}</button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-40">
                  <Link to="/farmer/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className={location.pathname === '/login' ? activeLinkClass : ''}>Login</Link>
            <Link to="/register" className={location.pathname === '/register' ? activeLinkClass : ''}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
