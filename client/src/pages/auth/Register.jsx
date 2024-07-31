import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { register } from '../../utils/apiUtils';
import {useToast} from '../../components/common/toast/Toast';
import styles from './Auth.module.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { addToast } = useToast();

  const registerMutation = useMutation(register, {
    onSuccess: () => {
      addToast('נרשמת בהצלחה', 'success');
      navigate('/login');
    },
    onError: (error) => {
      addToast(`שגיאה בהרשמה: ${error.message}`, 'error');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'שם משתמש הוא שדה חובה';
    if (!formData.email.trim()) newErrors.email = 'אימייל הוא שדה חובה';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'כתובת אימייל לא תקינה';
    if (!formData.password) newErrors.password = 'סיסמה היא שדה חובה';
    else if (formData.password.length < 6) newErrors.password = 'הסיסמה חייבת להכיל לפחות 6 תווים';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      registerMutation.mutate(formData);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>הרשמה</h2>
        
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

        <button type="submit" className={styles.submitButton} disabled={registerMutation.isLoading}>
          {registerMutation.isLoading ? 'מתבצעת הרשמה...' : 'הירשם'}
        </button>

        <p className={styles.switchAuthMode}>
          כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;