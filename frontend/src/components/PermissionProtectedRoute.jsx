import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PermissionProtectedRoute = ({ children, pageName }) => {
    const { user, accessToken, hasPagePermission } = useContext(AuthContext);

    // If there's no user or no access token, redirect to login
    if (!user || !accessToken) {
        return <Navigate to="/" replace />;
    }

    // Check if user has permission to view this page
    if (!hasPagePermission(pageName, 'can_view')) {
        return <Navigate to="/unauthorized" replace />;
    }

    // If authorized, render the page
    return children;
};

export default PermissionProtectedRoute;
