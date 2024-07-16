import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Home.module.css';

const features = [
  { title: "חיפוש מתקדם", description: "מצאו מתכונים לפי רכיבים, קטגוריות ואלרגנים" },
  { title: "דירוג וביקורות", description: "שתפו את החוויות שלכם ועזרו לאחרים למצוא את המתכונים הטובים ביותר" },
  { title: "שיתוף מתכונים", description: "הוסיפו את המתכונים האהובים עליכם ושתפו אותם עם הקהילה" }
];

function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>ברוכים הבאים למתכונים לאלרגיים</h1>
        <p>מצאו את המתכונים המושלמים שמתאימים לצרכים התזונתיים שלכם</p>
        <Link to="/recipes" className={styles.ctaButton}>גלו מתכונים</Link>
      </section>

      <section className={styles.features}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      {user ? (
        <section className={styles.userSection}>
          <h2>שלום, {user.username}!</h2>
          <p>מה תרצו לבשל היום?</p>
          <Link to="/add-recipe" className={styles.addRecipeButton}>הוסיפו מתכון חדש</Link>
        </section>
      ) : (
        <section className={styles.callToAction}>
          <h2>הצטרפו לקהילה שלנו</h2>
          <p>התחברו או הירשמו כדי להתחיל לשתף ולדרג מתכונים</p>
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.loginButton}>התחברות</Link>
            <Link to="/register" className={styles.registerButton}>הרשמה</Link>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;