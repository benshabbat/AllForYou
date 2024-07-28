import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FaSearch, FaUtensils, FaStar, FaBarcode, FaInfoCircle, FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../services/api';
import RecipeCard from '../components/recipe/recipeCard/RecipeCard';
import SearchBar from '../components/SearchBar';
import styles from './Home.module.css';

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const { data: popularRecipes = [] } = useQuery('popularRecipes', () => 
    api.get('/recipes/popular').then(res => res.data)
  );

  const { data: dailyTip } = useQuery('dailyTip', () => 
    api.get('/tips/daily').then(res => res.data)
  );

  const features = [
    { icon: <FaSearch />, title: "חיפוש מתקדם", description: "מצאו מתכונים לפי רכיבים, קטגוריות ואלרגנים" },
    { icon: <FaUtensils />, title: "מתכונים מותאמים אישית", description: "קבלו המלצות מתכונים המותאמות להעדפות התזונתיות שלכם" },
    { icon: <FaStar />, title: "דירוג וביקורות", description: "שתפו את החוויות שלכם ועזרו לאחרים למצוא את המתכונים הטובים ביותר" },
    { icon: <FaBarcode />, title: "סריקת ברקוד", description: "סרקו מוצרים כדי לבדוק התאמה להגבלות התזונתיות שלכם" },
    { icon: <FaInfoCircle />, title: "מידע על אלרגיות", description: "למדו עוד על אלרגיות מזון שונות והשפעותיהן" },
    { icon: <FaHeart />, title: "שמירת מועדפים", description: "שמרו את המתכונים האהובים עליכם לגישה מהירה" }
  ];

  const faqItems = [
    { question: "איך אני יכול להתאים מתכון לאלרגיה שלי?", answer: "בכל מתכון תוכלו למצוא אפשרויות להחלפת רכיבים אלרגניים. בנוסף, תוכלו לסנן מתכונים לפי אלרגנים ספציפיים." },
    { question: "האם אפשר להוסיף מתכונים משלי?", answer: "בהחלט! לאחר הרשמה, תוכלו להוסיף ולשתף מתכונים משלכם עם הקהילה." },
    { question: "איך עובד סורק הברקודים?", answer: "סורק הברקודים מאפשר לכם לסרוק מוצרים ולקבל מידע מיידי על התאמתם להגבלות התזונתיות שלכם." }
  ];

  const handleSlideChange = (direction) => {
    setActiveSlide(prev => {
      if (direction === 'next') {
        return (prev + 1) % popularRecipes.length;
      } else {
        return prev === 0 ? popularRecipes.length - 1 : prev - 1;
      }
    });
  };

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>בריא-לך</h1>
        <h2>כי לכל אחד מגיע מקום בשולחן - בואו לגלות עולם של אפשרויות</h2>
        <p>מצאו את המתכונים המושלמים שמתאימים לצרכים התזונתיים שלכם</p>
        <SearchBar onSearch={(query) => console.log(query)} placeholder="חפשו מתכון או אלרגן..." />
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

      {dailyTip && (
        <section className={styles.dailyTip}>
          <h2>טיפ יומי</h2>
          <p>{dailyTip.content}</p>
        </section>
      )}

      <section className={styles.popularRecipes}>
        <h2>מתכונים פופולריים</h2>
        <div className={styles.recipeCarousel}>
          <button onClick={() => handleSlideChange('prev')} className={styles.carouselButton} aria-label="מתכון קודם">
            <FaChevronRight />
          </button>
          <div className={styles.recipeSlide}>
            {popularRecipes[activeSlide] && <RecipeCard recipe={popularRecipes[activeSlide]} />}
          </div>
          <button onClick={() => handleSlideChange('next')} className={styles.carouselButton} aria-label="מתכון הבא">
            <FaChevronLeft />
          </button>
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
        <Link to="/register" className={styles.joinButton}>הצטרפו עכשיו</Link>
      </section>

      <section className={styles.faqSection}>
        <h2>שאלות נפוצות</h2>
        {faqItems.map((item, index) => (
          <div key={index} className={styles.faqItem}>
            <button 
              className={styles.faqQuestion} 
              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              aria-expanded={expandedFaq === index}
            >
              {item.question}
            </button>
            {expandedFaq === index && (
              <p className={styles.faqAnswer}>{item.answer}</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;