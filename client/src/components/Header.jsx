import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { GiCookingPot } from 'react-icons/gi';
import styles from './Header.module.css';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* לוגו - הוספת מרווח סביב הלוגו להבלטה והפרדה מהתפריט */}
        <Link to="/" className={styles.logo}>
          <GiCookingPot className={styles.logoIcon} />
          <span>מתכונים לאלרגיים</span>
        </Link>

        {/* תפריט ניווט */}
        <nav className={styles.nav}>
          {/* הוספת אפקט "hover" לקישורי התפריט עם שינוי צבע */}
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.activeLink : styles.navLink)} end>
            דף הבית
          </NavLink>
          <NavLink to="/recipes" className={({ isActive }) => (isActive ? styles.activeLink : styles.navLink)}>
            מתכונים
          </NavLink>
          {user ? (
            <>
              <NavLink to="/add-recipe" className={({ isActive }) => (isActive ? styles.activeLink : styles.navLink)}>
                הוסף מתכון
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? styles.activeLink : styles.navLink)}>
                פרופיל
              </NavLink>
              {/* כפתור התנתקות עם אפקט "hover" */}
              <button onClick={handleLogout} className={styles.logoutButton}>
                התנתק
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? styles.activeLink : styles.navLink)}>
                התחבר
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? styles.activeLink : styles.navLink)}>
                הרשם
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;