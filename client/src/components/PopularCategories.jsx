import React from 'react';
import { Link } from 'react-router-dom';
import { FaPizzaSlice, FaCarrot, FaBirthdayCake, FaCocktail } from 'react-icons/fa';
import styles from './PopularCategories.module.css';

const categories = [
  { name: 'מנות עיקריות', icon: <FaPizzaSlice />, link: '/recipes?category=mainCourse' },
  { name: 'סלטים', icon: <FaCarrot />, link: '/recipes?category=salads' },
  { name: 'קינוחים', icon: <FaBirthdayCake />, link: '/recipes?category=desserts' },
  { name: 'משקאות', icon: <FaCocktail />, link: '/recipes?category=drinks' },
];

const PopularCategories = () => {
  return (
    <section className={styles.popularCategories}>
      <h2>קטגוריות פופולריות</h2>
      <div className={styles.categoryGrid}>
        {categories.map((category, index) => (
          <Link key={index} to={category.link} className={styles.categoryCard}>
            <div className={styles.categoryIcon}>{category.icon}</div>
            <h3>{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories;