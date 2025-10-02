import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check for the token in localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  // If authenticated, render the children component (the protected page).
  // Otherwise, navigate to the login page.
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;