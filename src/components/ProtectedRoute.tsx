import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Replace with actual auth check
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
