import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/signin" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.user.role !== 'admin') {
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/signin" />;
  }

  return children;
};

export default AdminRoute;