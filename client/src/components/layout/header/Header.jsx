import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUtensils, FaBars } from "react-icons/fa";
import { useHeaderState } from "../../../hooks/useHeaderState";
import UserDropdown from "./UserDropdown";
import MobileMenu from "./MobileMenu";
import NavItems from "./NavItems";
import styles from "./Header.module.css";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { isMenuOpen, isScrolled, toggleMenu } = useHeaderState();

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <FaUtensils className={styles.logoIcon} aria-hidden="true" />
          <span className={styles.logoText}>מתכונים לאלרגיים</span>
        </Link>

        <nav className={styles.nav} role="navigation">
          <NavItems />
        </nav>

        <div className={styles.actions}>
          {user ? (
            <UserDropdown />
          ) : (
            <>
              <Link to="/login" className={styles.authLink}>התחבר</Link>
              <Link to="/register" className={styles.authLink}>הרשם</Link>
            </>
          )}
        </div>

        <button
          className={styles.mobileMenuToggle}
          onClick={toggleMenu}
          aria-label="תפריט"
          aria-expanded={isMenuOpen}
        >
          <FaBars aria-hidden="true" />
        </button>
      </div>

      <MobileMenu isMenuOpen={isMenuOpen} />
    </header>
  );
};

export default React.memo(Header);