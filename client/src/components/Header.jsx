import React, { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/auth/authSlice";
import { FaUtensils, FaUser, FaSignOutAlt, FaBars } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { path: "/", label: "דף הבית" },
  { path: "/recipes", label: "מתכונים" },
  { path: "/allergy-info", label: "מידע על אלרגיות" },
  { path: "/food-scanner", label: "סורק ברקודים" },
  { path: "/forum", label: "פורום" },
];

const USER_NAV_ITEMS = [
  { path: "/my-recipes", label: "המתכונים שלי" },
];

const USER_DROPDOWN_ITEMS = [
  { path: "/profile", label: "פרופיל" },
  { path: "/settings", label: "הגדרות" },
];

/**
 * Header component for the application.
 * Handles navigation, user authentication state, and responsive design.
 */
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/");
    setIsMenuOpen(false);
  }, [dispatch, navigate]);

  const renderNavItems = useCallback((items) => items.map((item) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}
      end
    >
      {item.label}
    </NavLink>
  )), []);

  const renderUserDropdown = useCallback(() => (
    <div className={styles.userMenu}>
      <button 
        className={styles.userButton} 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
      >
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
        <div className={styles.userDropdown} role="menu">
          {USER_DROPDOWN_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={styles.dropdownLink}
              onClick={() => setIsMenuOpen(false)}
              role="menuitem"
            >
              {item.label}
            </Link>
          ))}
          <button onClick={handleLogout} className={styles.logoutButton} role="menuitem">
            <FaSignOutAlt /> התנתק
          </button>
        </div>
      </CSSTransition>
    </div>
  ), [user, isMenuOpen, handleLogout]);

  const renderMobileMenu = useCallback(() => (
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
      <div className={styles.mobileMenu} role="menu">
        {renderNavItems([...NAV_ITEMS, ...(user ? USER_NAV_ITEMS : [])])}
        {user ? (
          <>
            {USER_DROPDOWN_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
              >
                {item.label}
              </Link>
            ))}
            <button onClick={handleLogout} className={styles.mobileLogoutButton} role="menuitem">
              <FaSignOutAlt /> התנתק
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)} role="menuitem">
              התחבר
            </Link>
            <Link to="/register" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)} role="menuitem">
              הרשם
            </Link>
          </>
        )}
      </div>
    </CSSTransition>
  ), [isMenuOpen, user, renderNavItems, handleLogout]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <FaUtensils className={styles.logoIcon} aria-hidden="true" />
          <span className={styles.logoText}>מתכונים לאלרגיים</span>
        </Link>

        <nav className={styles.nav} role="navigation">
          {renderNavItems(NAV_ITEMS)}
          {user && renderNavItems(USER_NAV_ITEMS)}
        </nav>

        <div className={styles.actions}>
          {user ? (
            renderUserDropdown()
          ) : (
            <>
              <Link to="/login" className={styles.authLink}>התחבר</Link>
              <Link to="/register" className={styles.authLink}>הרשם</Link>
            </>
          )}
        </div>

        <button
          className={styles.mobileMenuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="תפריט"
          aria-expanded={isMenuOpen}
        >
          <FaBars aria-hidden="true" />
        </button>
      </div>

      {renderMobileMenu()}
    </header>
  );
};

export default React.memo(Header);