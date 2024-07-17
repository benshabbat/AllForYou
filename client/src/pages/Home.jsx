import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSearch, FaUtensils, FaStar, FaUserPlus } from 'react-icons/fa';
import RecentRecipes from '../components/RecentRecipes';
import PopularCategories from '../components/PopularCategories';
import SearchBar from '../components/SearchBar';
import styles from './Home.module.css';

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  const features = [
    { icon: <FaSearch />, title: "חיפוש מתקדם", description: "מצאו מתכונים לפי רכיבים, קטגוריות ואלרגנים" },
    { icon: <FaUtensils />, title: "מתכונים מותאמים אישית", description: "קבלו המלצות מתכונים המותאמות להעדפות התזונתיות שלכם" },
    { icon: <FaStar />, title: "דירוג וביקורות", description: "שתפו את החוויות שלכם ועזרו לאחרים למצוא את המתכונים הטובים ביותר" }
  ];

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>ברוכים הבאים למתכונים לאלרגיים</h1>
        <p>מצאו את המתכונים המושלמים שמתאימים לצרכים התזונתיים שלכם</p>
        <SearchBar className={styles.heroSearch} />
        <Link to="/recipes" className={styles.ctaButton}>גלו מתכונים</Link>
      </section>

      <section className={styles.features}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      <RecentRecipes />

      <PopularCategories />

      {user ? (
        <section className={styles.userSection}>
          <h2>שלום, {user.username}!</h2>
          <p>מה תרצו לבשל היום?</p>
          <div className={styles.userActions}>
            <Link to="/add-recipe" className={styles.addRecipeButton}>הוסיפו מתכון חדש</Link>
            <Link to="/my-recipes" className={styles.myRecipesButton}>המתכונים שלי</Link>
          </div>
        </section>
      ) : (
        <section className={styles.callToAction}>
          <h2>הצטרפו לקהילה שלנו</h2>
          <p>התחברו או הירשמו כדי להתחיל לשתף ולדרג מתכונים</p>
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.loginButton}>התחברות</Link>
            <Link to="/register" className={styles.registerButton}>
              <FaUserPlus /> הרשמה
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;