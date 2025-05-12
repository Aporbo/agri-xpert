import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    const userRole = (decoded.role || decoded.user?.role || '').toLowerCase();

    // Check for role match
    if (role && userRole !== role.toLowerCase()) {
      console.warn(`Access denied: needed ${role}, got ${userRole}`);
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    console.error('Token decode failed:', err);
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
