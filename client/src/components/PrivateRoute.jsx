import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const PrivateRoute = ({ children }) => {
  const { user, isLoading, token } = useSelector((state: RootState) => state.auth);

  // אם עדיין טוען, נציג מסך טעינה או נחזיר null
  if (isLoading) {
    return <div>טוען...</div>; // או כל קומפוננטת טעינה אחרת
  }

  // אם יש משתמש או טוקן, נציג את התוכן
  if (user || token) {
    return children;
  }

  // אחרת, ננווט לדף ההתחברות
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;