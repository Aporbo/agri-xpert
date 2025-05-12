import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && allowedRoles.includes(user.role)
    ? <Outlet />
    : <Navigate to="/login" />;
};

export default ProtectedRoute;
