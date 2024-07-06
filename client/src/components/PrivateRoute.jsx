import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// קומפוננטה להגנה על נתיבים מאובטחים
const PrivateRoute = ({ children }) => {
  // בדיקה האם קיים משתמש מחובר
  const { user } = useSelector((state) => state.auth);
  
  // אם קיים משתמש, מציג את תוכן הדף. אחרת, מנווט לדף ההתחברות
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;