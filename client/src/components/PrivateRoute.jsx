import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // ייבוא טיפוס RootState

// קומפוננטת PrivateRoute מגנה על נתיבים שדורשים הרשאת גישה
const PrivateRoute = ({ children }) => {
  // בדיקה האם קיים משתמש מחובר
  const { user } = useSelector((state: RootState) => state.auth);
  
  // אם קיים משתמש מחובר, מציג את תוכן הדף. אחרת, מנווט לדף ההתחברות
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;