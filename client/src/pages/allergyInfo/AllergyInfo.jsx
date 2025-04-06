import React, { useState, useCallback } from 'react';
import { useAllergens } from '../../hooks/useAllergens';
import AllergenDetails from '../../components/allergen/allergenDetails/AllergenDetails';
import { generalInfo, additionalResources } from '../../constants/allergyInfo';
import { Loading } from '../../components/common';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import styles from './AllergyInfo.module.css';
import AllergenList from '../../components/allergen/allergenList/AllergenList';
import AdditionalResources from '../../components/additionalResources/AdditionalResources';
import GeneralInfo from '../../components/GeneralInfo';

const AllergyInfo = () => {
  const [selectedAllergen, setSelectedAllergen] = useState(null);
  const { data: allergens, isLoading, error } = useAllergens();

  const handleAllergenSelect = useCallback((allergenId) => {
    setSelectedAllergen(allergenId);
  }, []);

  if (isLoading) return <Loading message="טוען מידע על אלרגנים..." />;
  if (error) return <ErrorMessage message={`שגיאה בטעינת מידע: ${error.message}`} />;

  return (
    <div className={styles.allergyInfoContainer}>
      <h1 className={styles.mainTitle}>מידע על אלרגיות מזון</h1>
      <GeneralInfo info={generalInfo} />
      <div className={styles.content}>
        <AllergenList
          allergens={allergens}
          selectedAllergen={selectedAllergen}
          onSelect={handleAllergenSelect}
        />
        <AllergenDetails allergenId={selectedAllergen} />
      </div>
      <AdditionalResources resources={additionalResources} />
    </div>
  );
};

export default React.memo(AllergyInfo);