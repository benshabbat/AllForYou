import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/auth/authSlice";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import styles from "./UserDropdown.module.css";

const USER_DROPDOWN_ITEMS = [
  { path: "/profile", label: "פרופיל" },
  { path: "/settings", label: "הגדרות" },
];

const UserDropdown = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.userMenu}>
      <button
        className={styles.userButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
      >
        <FaUser /> {user.username}
      </button>
      {isMenuOpen && (
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
      )}
    </div>
  );
};

export default memo(UserDropdown);