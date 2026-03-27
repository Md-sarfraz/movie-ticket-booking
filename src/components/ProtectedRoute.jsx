import React from 'react'
import { Navigate } from 'react-router-dom'
import { getStoredAuth } from '../auth/storage';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { token, role } = getStoredAuth();

    if (!token) {
        return <Navigate to="/loginPage" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute