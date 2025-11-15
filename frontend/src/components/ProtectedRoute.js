import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
// import { Navigate } from 'react-router-dom'; // You don't need this anymore

const ProtectedRoute = ({ children }) => {
  // Use the hook correctly to get the state
  const { isLoading } = useAuth0();

  if (isLoading) {
    // Show a loading spinner while Auth0 is initializing
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 👇 The key change: The component ALWAYS returns the children
  // (the requested route element) once loading is complete.
  return children;
};

export default ProtectedRoute;

