import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import styles from './Auth.module.css';

function Register() {
  // ניהול מצב הטופס
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  // ניהול שגיאות ולידציה
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // שליפת מצב הרישום מה-Redux store
  const { isLoading, error } = useSelector((state) => state.auth);

  // ניקוי שגיאות בעת עזיבת הקומפוננטה
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
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  // ולידציה של הטופס
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'שם משתמש הוא שדה חובה';
    if (!formData.email.trim()) newErrors.email = 'אימייל הוא שדה חובה';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'כתובת אימייל לא תקינה';
    if (!formData.password) newErrors.password = 'סיסמה היא שדה חובה';
    else if (formData.password.length < 8) newErrors.password = 'הסיסמה חייבת להכיל לפחות 8 תווים';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'הסיסמה חייבת להכיל אות גדולה, אות קטנה ומספר';
    }
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // טיפול בשליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // שליחת פרטי הרישום ל-Redux
        await dispatch(register(formData)).unwrap();
        toast.success('נרשמת בהצלחה');
        navigate('/profile');
      } catch (err) {
        toast.error(err || 'שגיאה בהרשמה. אנא נסה שוב.');
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>הרשמה</h2>
        
        {/* שדה שם משתמש */}
        <div className={styles.formGroup}>
          <label htmlFor="username">שם משתמש</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? styles.inputError : ''}
          />
          {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
        </div>

        {/* שדה אימייל */}
        <div className={styles.formGroup}>
          <label htmlFor="email">אימייל</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? styles.inputError : ''}
          />
          {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
        </div>

        {/* שדה סיסמה */}
        <div className={styles.formGroup}>
          <label htmlFor="password">סיסמה</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? styles.inputError : ''}
          />
          {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
        </div>

        {/* שדה אימות סיסמה */}
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">אימות סיסמה</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? styles.inputError : ''}
          />
          {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
        </div>

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