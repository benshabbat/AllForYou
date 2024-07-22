import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { FaUtensils, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { CSSTransition } from 'react-transition-group';
import styles from './Header.module.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <FaUtensils className={styles.logoIcon} />
          <span className={styles.logoText}>מתכונים לאלרגיים</span>
        </Link>

        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink} end>
            דף הבית
          </NavLink>
          <NavLink to="/recipes" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
            מתכונים
          </NavLink>
          <NavLink to="/allergy-info" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
            מידע על אלרגיות
          </NavLink>
          <NavLink to="/food-scanner" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
            סורק ברקודים
          </NavLink>
          {user && (
            <NavLink to="/my-recipes" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
              המתכונים שלי
            </NavLink>
          )}
        </nav>

        <div className={styles.actions}>
          {user ? (
            <div className={styles.userMenu}>
              <button className={styles.userButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <FaUser /> {user.username}
              </button>
              <CSSTransition
                in={isMenuOpen}
                timeout={300}
                classNames={{
                  enter: styles.dropdownEnter,
                  enterActive: styles.dropdownEnterActive,
                  exit: styles.dropdownExit,
                  exitActive: styles.dropdownExitActive,
                }}
                unmountOnExit
              >
                <div className={styles.userDropdown}>
                  <Link to="/profile" className={styles.dropdownLink} onClick={() => setIsMenuOpen(false)}>פרופיל</Link>
                  <Link to="/settings" className={styles.dropdownLink} onClick={() => setIsMenuOpen(false)}>הגדרות</Link>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    <FaSignOutAlt /> התנתק
                  </button>
                </div>
              </CSSTransition>
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.authLink}>התחבר</Link>
              <Link to="/register" className={styles.authLink}>הרשם</Link>
            </>
          )}
        </div>

        <button className={styles.mobileMenuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FaBars />
        </button>
      </div>

      <CSSTransition
        in={isMenuOpen}
        timeout={300}
        classNames={{
          enter: styles.mobileMenuEnter,
          enterActive: styles.mobileMenuEnterActive,
          exit: styles.mobileMenuExit,
          exitActive: styles.mobileMenuExitActive,
        }}
        unmountOnExit
      >
        <div className={styles.mobileMenu}>
          <NavLink to="/" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>דף הבית</NavLink>
          <NavLink to="/recipes" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>מתכונים</NavLink>
          <NavLink to="/allergy-info" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>מידע על אלרגיות</NavLink>
          <NavLink to="/food-scanner" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>סורק ברקודים</NavLink>
          {user && (
            <NavLink to="/my-recipes" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>המתכונים שלי</NavLink>
          )}
          {user ? (
            <>
              <Link to="/profile" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>פרופיל</Link>
              <Link to="/settings" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>הגדרות</Link>
              <button onClick={handleLogout} className={styles.mobileLogoutButton}>
                <FaSignOutAlt /> התנתק
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>התחבר</Link>
              <Link to="/register" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>הרשם</Link>
            </>
          )}
        </div>
      </CSSTransition>
    </header>
  );
};

export default Header;