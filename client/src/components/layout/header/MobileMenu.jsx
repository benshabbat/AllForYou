import { Link } from "react-router-dom";
import styles from "./MobileMenu.module.css";
import { memo } from "react";

const MobileMenu = ({ isMenuOpen }) => {
  if (!isMenuOpen) return null;

  return (
    <div className={styles.mobileMenu} role="menu">
      <Link to="/" className={styles.mobileLink}>דף הבית</Link>
      <Link to="/recipes" className={styles.mobileLink}>מתכונים</Link>
      <Link to="/allergy-info" className={styles.mobileLink}>מידע על אלרגיות</Link>
      <Link to="/food-scanner" className={styles.mobileLink}>סורק ברקודים</Link>
      <Link to="/forum" className={styles.mobileLink}>פורום</Link>
    </div>
  );
};

export default memo(MobileMenu);