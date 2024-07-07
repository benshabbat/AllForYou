import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import styles from './Auth.module.css';

function Register() {
  // מצב טופס ההרשמה
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  // מצב שגיאות הטופס
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // בחירת מצב האימות מה-store
  const { isLoading, error } = useSelector((state) => state.auth);

  // ניקוי שגיאות בעת טעינת הקומפוננטה
  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  // טיפול בשינויים בשדות הטופס
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // ניקוי שגיאות ספציפיות בעת הקלדה
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  // וולידציה של הטופס
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'שם משתמש הוא שדה חובה';
    if (!formData.email.trim()) newErrors.email = 'אימייל הוא שדה חובה';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'כתובת אימייל לא תקינה';
    if (!formData.password) newErrors.password = 'סיסמה היא שדה חובה';
    else if (formData.password.length < 6) newErrors.password = 'הסיסמה חייבת להכיל לפחות 6 תווים';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // טיפול בשליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await dispatch(register(formData));
      if (!result.error) {
        toast.success('נרשמת בהצלחה'); 
        navigate('/profile');
      }
    }
  };

  // רינדור הקומפוננטה
  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>הרשמה</h2>
        
        {/* שדות הטופס */}
        {/* ... (קוד השדות נשאר ללא שינוי) ... */}

        {/* הצגת שגיאות שרת */}
        {error && <div className={styles.serverError}>{error}</div>}

        {/* כפתור שליחה */}
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'מתבצעת הרשמה...' : 'הירשם'}
        </button>

        {/* קישור להתחברות */}
        <p className={styles.switchAuthMode}>
          כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;