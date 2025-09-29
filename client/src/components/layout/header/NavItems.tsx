import { NavLink } from "react-router-dom";
import { memo } from "react";
import { FC } from 'react';
import styles from "./NavItems.module.css";

interface NavItem {
  path: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "דף הבית" },
  { path: "/recipes", label: "מתכונים" },
  { path: "/allergy-info", label: "מידע על אלרגיות" },
  { path: "/food-scanner", label: "סורק ברקודים" },
  { path: "/forum", label: "פורום" },
];

const NavItems: FC = () => (
  <>
    {NAV_ITEMS.map((item: NavItem) => (
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

export default memo(NavItems);