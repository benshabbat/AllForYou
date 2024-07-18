// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUtensils, FaStar } from 'react-icons/fa';
import styles from './Home.module.css';

const Home = () => {
  // Array of features to display on the home page
  const features = [
    { icon: <FaSearch />, title: "חיפוש מתקדם", description: "מצאו מתכונים לפי רכיבים, קטגוריות ואלרגנים" },
    { icon: <FaUtensils />, title: "מתכונים מותאמים אישית", description: "קבלו המלצות מתכונים המותאמות להעדפות התזונתיות שלכם" },
    { icon: <FaStar />, title: "דירוג וביקורות", description: "שתפו את החוויות שלכם ועזרו לאחרים למצוא את המתכונים הטובים ביותר" }
  ];

  return (
    <div className={styles.home}>
      {/* Hero section */}
      <section className={styles.hero}>
        <h1>ברוכים הבאים למתכונים לאלרגיים</h1>
        <p>מצאו את המתכונים המושלמים שמתאימים לצרכים התזונתיים שלכם</p>
        <Link to="/recipes" className={styles.ctaButton}>גלו מתכונים</Link>
      </section>

      {/* Features section */}
      <section className={styles.features}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;