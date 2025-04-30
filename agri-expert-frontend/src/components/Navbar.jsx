import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-green-600 p-4 flex justify-between items-center text-white">
      <Link to="/" className="text-2xl font-bold">Agri Expert System</Link>
      <div className="flex gap-4">
        <Link to="/login" className="hover:text-gray-200">Login</Link>
        <Link to="/register" className="hover:text-gray-200">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
