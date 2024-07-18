
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { GiCookingPot } from 'react-icons/gi';
import styles from './Header.module.css';

function Header() {
  const dispatch = useDispatch();
  const { user, isInitialized } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo and app name */}
        <Link to="/" className={styles.logo}>
          <GiCookingPot className={styles.logoIcon} />
          <span>מתכונים לאלרגיים</span>
        </Link>

        {/* Navigation menu */}
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink} end>
            דף הבית
          </NavLink>
          <NavLink to="/recipes" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
            מתכונים
          </NavLink>
          {user ? (
            // Menu for logged-in user
            <>
              <NavLink to="/add-recipe" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                הוסף מתכון
              </NavLink>
              <NavLink to="/my-recipes" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                המתכונים שלי
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                פרופיל
              </NavLink>
              <button onClick={handleLogout} className={styles.logoutButton}>
                התנתק
              </button>
            </>
          ) : (
            // Menu for non-logged-in user
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                התחבר
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
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