import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import styles from './Auth.module.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // ניקוי שגיאות בעת טעינת הקומפוננטה
    return () => dispatch(clearError());
  }, [dispatch]);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'אימייל הוא שדה חובה';
    if (!formData.password) newErrors.password = 'סיסמה היא שדה חובה';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await dispatch(login(formData));
      if (!result.error) {
        toast.success('התחברת בהצלחה!'); 
        navigate('/profile');
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>התחברות</h2>
        
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

        {error && <div className={styles.serverError}>{error}</div>}

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'מתחבר...' : 'התחבר'}
        </button>

        <p className={styles.switchAuthMode}>
          אין לך חשבון? <Link to="/register">הירשם כאן</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;