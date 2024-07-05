import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import styles from './Header.module.css';

function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          מתכונים לאלרגיים
        </Link>
        <nav className={styles.nav}>
          <NavLink to="/" className={({isActive}) => isActive ? styles.activeLink : styles.link} end>
            דף הבית
          </NavLink>
          <NavLink to="/recipes" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
            מתכונים
          </NavLink>
          {user ? (
            <>
              <NavLink to="/add-recipe" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
                הוסף מתכון
              </NavLink>
              <button onClick={handleLogout} className={styles.logoutButton}>התנתק</button>
            </>
          ) : (
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
      </div>
    </header>
  );
}

export default Header;