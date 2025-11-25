import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, accessToken } = useContext(AuthContext);

  // If there's no user or no access token, redirect to login
  if (!user || !accessToken) {
    return <Navigate to="/" replace />;
  }

  // If user is not a super admin, redirect to login (or a "not authorized" page)
  if (!user.is_super_admin) {
    return <Navigate to="/" replace />;
  }

  // If authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
