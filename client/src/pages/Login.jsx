import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import styles from './Auth.module.css';

// TODO: Import a custom hook for form validation
// import useFormValidation from '../hooks/useFormValidation';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useSelector((state) => state.auth);

  // TODO: Use custom hook for form validation
  // const { validateForm, validateField } = useFormValidation();

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    
    // TODO: Implement real-time field validation
    // const fieldError = validateField(name, value);
    // setErrors(prevErrors => ({ ...prevErrors, [name]: fieldError }));
  };

  // TODO: Implement more robust form validation
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
      try {
        await dispatch(login(formData)).unwrap();
        // נסיר את הניווט מכאן כי הוא יתבצע ב-useEffect
      } catch (err) {
        console.error('Login error:', err);
        toast.error(err.message || 'שגיאה בהתחברות. אנא נסה שוב.');
      }
    }
  };

  // TODO: Implement password visibility toggle
  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };

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
          {/* TODO: Add "Forgot Password" link */}
        </div>

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