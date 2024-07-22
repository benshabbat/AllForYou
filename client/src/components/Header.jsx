// Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { GiCookingPot, GiHamburgerMenu } from 'react-icons/gi';
import { FaUser, FaSignOutAlt, FaSearch, FaBarcode, FaSun, FaMoon } from 'react-icons/fa';
import { CSSTransition } from 'react-transition-group';
import Modal from './Modal';
import BarcodeScanner from './BarcodeScanner';
import styles from './Header.module.css';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isInitialized } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsSearchOpen(false);
    }
  };

  const handleScan = (data) => {
    if (data) {
      navigate(`/food-scanner?code=${encodeURIComponent(data)}`);
      setIsScannerOpen(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <GiCookingPot className={styles.logoIcon} />
          <span className={styles.logoText}>מתכונים לאלרגיים</span>
        </Link>

        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink} end>
            דף הבית
          </NavLink>
          <NavLink to="/recipes" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
            מתכונים
          </NavLink>
          {user && (
            <>
              <NavLink to="/add-recipe" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                הוסף מתכון
              </NavLink>
              <NavLink to="/my-recipes" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                המתכונים שלי
              </NavLink>
            </>
          )}
        </nav>

        <div className={styles.actions}>
          <button 
            className={styles.iconButton}
            onClick={toggleSearch}
            aria-label="חיפוש"
          >
            <FaSearch />
          </button>
          <button 
            className={styles.iconButton} 
            onClick={() => setIsScannerOpen(true)}
            aria-label="סרוק ברקוד"
          >
            <FaBarcode />
          </button>
          <button 
            className={styles.iconButton} 
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "עבור למצב יום" : "עבור למצב לילה"}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          {user ? (
            <div className={styles.userMenu}>
              <button className={styles.userButton}>
                <FaUser /> {user.username}
              </button>
              <div className={styles.userDropdown}>
                <NavLink to="/profile" className={styles.dropdownLink}>פרופיל</NavLink>
                <NavLink to="/settings" className={styles.dropdownLink}>הגדרות</NavLink>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  <FaSignOutAlt /> התנתק
                </button>
              </div>
            </div>
          ) : (
            <>
              <NavLink to="/login" className={styles.authLink}>התחבר</NavLink>
              <NavLink to="/register" className={styles.authLink}>הרשם</NavLink>
            </>
          )}
          <button 
            className={styles.menuToggle} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={isMenuOpen}
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </div>

      <CSSTransition
        in={isSearchOpen}
        timeout={300}
        classNames={{
          enter: styles.searchEnter,
          enterActive: styles.searchEnterActive,
          exit: styles.searchExit,
          exitActive: styles.searchExitActive,
        }}
        unmountOnExit
      >
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="חפש מתכונים..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchSubmit}>חפש</button>
        </form>
      </CSSTransition>

      <CSSTransition
        in={isMenuOpen}
        timeout={300}
        classNames={{
          enter: styles.menuEnter,
          enterActive: styles.menuEnterActive,
          exit: styles.menuExit,
          exitActive: styles.menuExitActive,
        }}
        unmountOnExit
      >
        <div className={styles.mobileMenu}>
          <NavLink to="/" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>דף הבית</NavLink>
          <NavLink to="/recipes" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>מתכונים</NavLink>
          {user && (
            <>
              <NavLink to="/add-recipe" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>הוסף מתכון</NavLink>
              <NavLink to="/my-recipes" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>המתכונים שלי</NavLink>
            </>
          )}
          {!user && (
            <>
              <NavLink to="/login" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>התחבר</NavLink>
              <NavLink to="/register" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>הרשם</NavLink>
            </>
          )}
        </div>
      </CSSTransition>

      <Modal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)}
        title="סריקת ברקוד"
      >
        <BarcodeScanner onScan={handleScan} onClose={() => setIsScannerOpen(false)} />
      </Modal>
    </header>
  );
}

export default Header;