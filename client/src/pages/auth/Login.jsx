import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { apiUtils } from '../../utils/apiUtils';
import {useToast} from '../../components/common/toast/Toast';
import styles from './Auth.module.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { addToast } = useToast();

  const loginMutation = useMutation(apiUtils?.login, {
    onSuccess: (data) => {
      addToast('התחברת בהצלחה!', 'success');
      // כאן אתה יכול לשמור את הטוקן ומידע המשתמש ב-localStorage או ב-Redux store
      localStorage.setItem('token', data.token);
      navigate('/profile');
    },
    onError: (error) => {
      addToast(`שגיאה בהתחברות: ${error.message}`, 'error');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
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
      loginMutation.mutate(formData);
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

        <button type="submit" className={styles.submitButton} disabled={loginMutation.isLoading}>
          {loginMutation.isLoading ? 'מתחבר...' : 'התחבר'}
        </button>

        <p className={styles.switchAuthMode}>
          אין לך חשבון? <Link to="/register">הירשם כאן</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;