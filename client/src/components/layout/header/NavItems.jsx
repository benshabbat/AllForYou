import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavItems.module.css";

const NAV_ITEMS = [
  { path: "/", label: "דף הבית" },
  { path: "/recipes", label: "מתכונים" },
  { path: "/allergy-info", label: "מידע על אלרגיות" },
  { path: "/food-scanner", label: "סורק ברקודים" },
  { path: "/forum", label: "פורום" },
];

const NavItems = () => (
  <>
    {NAV_ITEMS.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}
        end
      >
        {item.label}
      </NavLink>
    ))}
  </>
);

export default React.memo(NavItems);