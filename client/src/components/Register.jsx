import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../store/slices/authSlice';
import styles from './Register.module.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('הסיסמאות אינן תואמות');
      return;
    }
    const result = await dispatch(register(formData));
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>הצטרפו לקהילת המתכונים שלנו</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">שם משתמש</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="הזן שם משתמש"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">אימייל</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="הזן כתובת אימייל"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">סיסמה</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="בחר סיסמה"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">אימות סיסמה</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="הזן את הסיסמה שנית"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'מתבצעת הרשמה...' : 'הירשם עכשיו'}
          </button>
        </form>
        <p className={styles.loginLink}>
          כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
        </p>
      </div>
      <div className={styles.imageContainer}>
        <div className={styles.imageOverlay}></div>
      </div>
    </div>
  );
}

export default Register;