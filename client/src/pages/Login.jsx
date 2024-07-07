import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import styles from './Auth.module.css';

function Login() {
  // ניהול מצב הטופס
  const [formData, setFormData] = useState({ email: '', password: '' });
  // ניהול שגיאות ולידציה
  const [errors, setErrors] = useState({});
  // ניהול מצב "זכור אותי"
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // שליפת מצב האימות מה-Redux store
  const { isLoading, error, user } = useSelector((state) => state.auth);

  // ניקוי שגיאות בעת עזיבת הקומפוננטה
  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  // ניווט לפרופיל אם המשתמש כבר מחובר
  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  // טיפול בשינויים בשדות הטופס
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  // ולידציה של הטופס
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'אימייל הוא שדה חובה';
    if (!formData.password) newErrors.password = 'סיסמה היא שדה חובה';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // טיפול בשליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // שליחת פרטי ההתחברות ל-Redux
        await dispatch(login({ ...formData, rememberMe })).unwrap();
        toast.success('התחברת בהצלחה!');
      } catch (err) {
        toast.error(err || 'שגיאה בהתחברות. אנא נסה שוב.');
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>התחברות</h2>
        
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

        {/* אפשרות "זכור אותי" */}
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            זכור אותי
          </label>
        </div>

        {/* הצגת שגיאות שרת */}
        {error && <div className={styles.serverError}>{error}</div>}

        {/* כפתור שליחה */}
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'מתחבר...' : 'התחבר'}
        </button>

        {/* קישור להרשמה */}
        <p className={styles.switchAuthMode}>
          אין לך חשבון? <Link to="/register">הירשם כאן</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;