import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { GiCookingPot, GiHamburgerMenu } from 'react-icons/gi';
import { FaUser, FaSignOutAlt, FaSearch, FaBarcode } from 'react-icons/fa';
import Modal from '../components/Modal';
import BarcodeScanner from '../components/BarcodeScanner';
import styles from './Header.module.css';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isInitialized } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleScan = (data) => {
    if (data) {
      navigate(`/food-scanner?code=${encodeURIComponent(data)}`);
      setIsScannerOpen(false);
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <GiCookingPot className={styles.logoIcon} />
          <span>מתכונים לאלרגיים</span>
        </Link>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="חפש מתכונים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit"><FaSearch /></button>
        </form>

        <button 
          className={styles.scanButton} 
          onClick={() => setIsScannerOpen(true)}
          aria-label="סרוק ברקוד"
        >
          <FaBarcode />
        </button>

        <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <GiHamburgerMenu />
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink} end>
            דף הבית
          </NavLink>
          <NavLink to="/recipes" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
            מתכונים
          </NavLink>
          {user ? (
            <>
              <NavLink to="/add-recipe" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                הוסף מתכון
              </NavLink>
              <NavLink to="/my-recipes" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                המתכונים שלי
              </NavLink>
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
            </>
          ) : (
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