import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Agri Expert</h1>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:underline">Home</Link>

        {user?.role === 'FARMER' && (
          <>
            <Link to="/farmer" className="hover:underline">Dashboard</Link>
            <Link to="/farmer/history" className="hover:underline">History</Link>
          </>
        )}

        {user?.role === 'ADMIN' && (
          <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
        )}
        

        {user ? (
  <>
    <Link to="/farmer/profile" className="hover:underline font-semibold">
      {user.name}
    </Link>
    <button onClick={logout} className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-200">Logout</button>
  </>
) : (
  <>
    <Link to="/login" className="hover:underline">Login</Link>
    <Link to="/register" className="hover:underline">Register</Link>
  </>
)}
      </div>
    </nav>
  );
};

export default Navbar;
