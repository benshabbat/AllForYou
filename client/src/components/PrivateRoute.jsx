import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { user, isLoading, token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    // אפשר להחליף זאת בקומפוננטת טעינה מותאמת אישית
    return <div>טוען...</div>;
  }

  if (!user && !token) {
    // שמירת המיקום הנוכחי כדי לחזור אליו לאחר ההתחברות
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;