import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { GiCookingPot } from 'react-icons/gi';
import styles from './Header.module.css';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // קבלת נתוני המשתמש מה-store
  const { user } = useSelector((state) => state.auth);

  // טיפול בלחיצה על כפתור ההתנתקות
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className={styles.header}>
      {/* לוגו ושם האתר */}
      <div className={styles.logo}>
        <GiCookingPot className={styles.logoIcon} />
        <Link to="/" className={styles.logoText}>מתכונים לאלרגיים</Link>
      </div>
      {/* תפריט ניווט */}
      <nav className={styles.nav}>
        <NavLink to="/" className={({isActive}) => isActive ? styles.activeLink : styles.link} end>
          דף הבית
        </NavLink>
        <NavLink to="/recipes" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
          מתכונים
        </NavLink>
        {user ? (
          // תפריט למשתמשים מחוברים
          <>
            <NavLink to="/add-recipe" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
              הוסף מתכון
            </NavLink>
            <NavLink to="/profile" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
              פרופיל
            </NavLink>
            <button onClick={handleLogout} className={styles.logoutButton}>התנתק</button>
          </>
        ) : (
          // תפריט למשתמשים לא מחוברים
          <>
            <NavLink to="/login" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
              התחבר
            </NavLink>
            <NavLink to="/register" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
              הרשם
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;