import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Home.module.css';

// TODO: Import pre-made components as needed
// import { Button, Card } from '../components';

const features = [
  { title: "חיפוש מתקדם", description: "מצאו מתכונים לפי רכיבים, קטגוריות ואלרגנים" },
  { title: "דירוג וביקורות", description: "שתפו את החוויות שלכם ועזרו לאחרים למצוא את המתכונים הטובים ביותר" },
  { title: "שיתוף מתכונים", description: "הוסיפו את המתכונים האהובים עליכם ושתפו אותם עם הקהילה" }
];

function Home() {
  const { user } = useSelector((state) => state.auth);

  const FeatureCards = useMemo(() => features.map((feature, index) => (
    <div key={index} className={styles.feature}>
      <h2>{feature.title}</h2>
      <p>{feature.description}</p>
    </div>
  )), []);

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>ברוכים הבאים למתכונים לאלרגיים</h1>
        <p>מצאו את המתכונים המושלמים שמתאימים לצרכים התזונתיים שלכם</p>
        {/* TODO: Consider using a Button component here */}
        <Link to="/recipes" className={styles.ctaButton}>גלו מתכונים</Link>
      </section>

      <section className={styles.features}>
        {FeatureCards}
      </section>

      {user ? (
        <section className={styles.userSection}>
          <h2>שלום, {user.username}!</h2>
          <p>מה תרצו לבשל היום?</p>
          {/* TODO: Consider using a Button component here */}
          <Link to="/add-recipe" className={styles.addRecipeButton}>הוסיפו מתכון חדש</Link>
        </section>
      ) : (
        <section className={styles.callToAction}>
          <h2>הצטרפו לקהילה שלנו</h2>
          <p>התחברו או הירשמו כדי להתחיל לשתף ולדרג מתכונים</p>
          <div className={styles.authButtons}>
            {/* TODO: Consider using Button components here */}
            <Link to="/login" className={styles.loginButton}>התחברות</Link>
            <Link to="/register" className={styles.registerButton}>הרשמה</Link>
          </div>
        </section>
      )}
    </div>
  );
}

export default React.memo(Home);