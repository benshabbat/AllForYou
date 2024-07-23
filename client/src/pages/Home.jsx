import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUtensils, FaStar, FaBarcode, FaInfoCircle, FaHeart } from 'react-icons/fa';
import styles from './Home.module.css';

const Home = () => {
  const features = [
    { icon: <FaSearch />, title: "חיפוש מתקדם", description: "מצאו מתכונים לפי רכיבים, קטגוריות ואלרגנים" },
    { icon: <FaUtensils />, title: "מתכונים מותאמים אישית", description: "קבלו המלצות מתכונים המותאמות להעדפות התזונתיות שלכם" },
    { icon: <FaStar />, title: "דירוג וביקורות", description: "שתפו את החוויות שלכם ועזרו לאחרים למצוא את המתכונים הטובים ביותר" },
    { icon: <FaBarcode />, title: "סריקת ברקוד", description: "סרקו מוצרים כדי לבדוק התאמה להגבלות התזונתיות שלכם" },
    { icon: <FaInfoCircle />, title: "מידע על אלרגיות", description: "למדו עוד על אלרגיות מזון שונות והשפעותיהן" },
    { icon: <FaHeart />, title: "שמירת מועדפים", description: "שמרו את המתכונים האהובים עליכם לגישה מהירה" }
  ];

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>ברוכים הבאים למתכונים לאלרגיים</h1>
        <p>מצאו את המתכונים המושלמים שמתאימים לצרכים התזונתיים שלכם</p>
        <div className={styles.ctaButtons}>
          <Link to="/recipes" className={styles.ctaButton}>גלו מתכונים</Link>
          <Link to="/food-scanner" className={styles.ctaButton}>סרקו מוצר</Link>
        </div>
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

      <section className={styles.popularRecipes}>
        <h2>מתכונים פופולריים</h2>
        <div className={styles.recipeGrid}>
          {/* כאן יוצגו מתכונים פופולריים */}
        </div>
        <Link to="/recipes" className={styles.viewAllButton}>צפה בכל המתכונים</Link>
      </section>

      <section className={styles.allergyInfo}>
        <h2>מידע על אלרגיות מזון</h2>
        <p>למדו עוד על אלרגיות מזון נפוצות, תסמינים, ואיך להתמודד איתן.</p>
        <Link to="/allergy-info" className={styles.infoButton}>קרא עוד</Link>
      </section>

      <section className={styles.communitySection}>
        <h2>הצטרפו לקהילה שלנו</h2>
        <p>שתפו מתכונים, חוויות, וטיפים עם אנשים אחרים שמתמודדים עם אלרגיות מזון.</p>
        <button className={styles.joinButton}>הצטרפו עכשיו</button>
      </section>
    </div>
  );
};

export default Home;