import React from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';
import styles from './AllergenInfo.module.css';

const AllergenInfo = ({ allergenId }) => {
  const { data: allergen, isLoading, error } = useQuery(
    ['allergen', allergenId],
    () => api.get(`/allergens/${allergenId}`).then(res => res.data)
  );

  if (isLoading) return <div>טוען מידע על אלרגן...</div>;
  if (error) return <div>שגיאה בטעינת מידע על אלרגן</div>;

  return (
    <div className={styles.allergenInfo}>
      <h2>{allergen.hebrewName} ({allergen.name})</h2>
      <p className={styles.description}>{allergen.description}</p>
      
      <h3>תסמינים נפוצים:</h3>
      <ul className={styles.symptomsList}>
        {allergen.symptoms.map((symptom, index) => (
          <li key={index}>{symptom}</li>
        ))}
      </ul>

      <h3>מזונות להימנע מהם:</h3>
      <ul className={styles.avoidList}>
        {allergen.avoidList.map((food, index) => (
          <li key={index}>{food}</li>
        ))}
      </ul>

      <h3>חלופות מומלצות:</h3>
      <ul className={styles.alternativesList}>
        {allergen.alternatives.map((alternative, index) => (
          <li key={index}>{alternative}</li>
        ))}
      </ul>

      <div className={styles.severityInfo}>
        <h3>רמת חומרה:</h3>
        <span className={styles[allergen.severity.toLowerCase()]}>{allergen.severity}</span>
      </div>

      <div className={styles.tips}>
        <h3>טיפים להתמודדות:</h3>
        <ul>
          <li>קראו תוויות מזון בקפידה</li>
          <li>הודיעו למסעדות על האלרגיה שלכם בעת הזמנה</li>
          <li>שאו עמכם תרופות אנטי-היסטמיניות או אפיפן במקרה הצורך</li>
          <li>התייעצו עם דיאטנית לגבי תחליפים מתאימים</li>
        </ul>
      </div>
    </div>
  );
};

export default AllergenInfo;