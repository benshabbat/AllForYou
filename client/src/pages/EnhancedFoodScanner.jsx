import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { FaBarcode, FaSearch, FaHistory, FaExclamationTriangle, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import AllergenManagement from '../components/AllergenManagement';
import AlternativeProducts from '../components/AlternativeProducts';
import styles from './EnhancedFoodScanner.module.css';
import BarcodeReader from 'react-barcode-reader';

const EnhancedFoodScanner = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const { addToast } = useToast();

  const { data: userData, isLoading: isLoadingUserData } = useQuery('userData', () =>
    api.get('/user/data').then(res => res.data)
  );

  const { data: productInfo, isLoading, error, refetch } = useQuery(
    ['productInfo', scannedCode],
    () => api.get(`/products/${scannedCode}`),
    { enabled: !!scannedCode }
  );

  const addToHistoryMutation = useMutation(
    (product) => api.post('/user/scan-history', product),
    {
      onSuccess: () => {
        addToast('המוצר נוסף להיסטוריה', 'success');
        fetchScanHistory();
      },
    }
  );

  const fetchScanHistory = useCallback(async () => {
    try {
      const response = await api.get('/user/scan-history');
      setScanHistory(response.data);
    } catch (error) {
      addToast('שגיאה בטעינת היסטוריית הסריקות', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    fetchScanHistory();
  }, [fetchScanHistory]);

  const handleScan = (data) => {
    setScannedCode(data);
    refetch();
    addToast('מוצר נסרק בהצלחה!', 'success');
  };

  const handleError = (err) => {
    console.error(err);
    addToast('שגיאה בסריקת הברקוד. נסה שוב.', 'error');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setScannedCode(manualCode);
    refetch();
  };

  const checkAllergens = (product) => {
    if (!userData || !userData.allergens) return [];
    return product.allergens.filter(allergen => 
      userData.allergens.includes(allergen)
    );
  };

  const renderProductInfo = () => {
    if (!productInfo) return null;

    const allergenWarnings = checkAllergens(productInfo);

    return (
      <div className={styles.productInfo}>
        <h2>{productInfo.name}</h2>
        <p><strong>יצרן:</strong> {productInfo.manufacturer}</p>
        <p><strong>רכיבים:</strong> {productInfo.ingredients.join(', ')}</p>
        <p><strong>ערכים תזונתיים (ל-100 גרם):</strong></p>
        <ul>
          <li>קלוריות: {productInfo.nutritionalInfo.calories}</li>
          <li>חלבונים: {productInfo.nutritionalInfo.protein}ג</li>
          <li>פחמימות: {productInfo.nutritionalInfo.carbs}ג</li>
          <li>שומנים: {productInfo.nutritionalInfo.fat}ג</li>
        </ul>
        <p><strong>אלרגנים:</strong> {productInfo.allergens.join(', ') || 'אין מידע'}</p>
        
        {allergenWarnings.length > 0 && (
          <div className={styles.allergenWarning}>
            <FaExclamationTriangle /> אזהרה: מוצר זה מכיל אלרגנים שציינת ברשימה שלך:
            <ul>
              {allergenWarnings.map(allergen => (
                <li key={allergen}>{allergen}</li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={() => addToHistoryMutation.mutate(productInfo)} className={styles.addToHistoryButton}>
          הוסף להיסטוריה
        </button>

        {allergenWarnings.length > 0 && userData && (
          <AlternativeProducts product={productInfo} userAllergens={userData.allergens} />
        )}
      </div>
    );
  };

  if (isLoadingUserData) {
    return <div>טוען נתוני משתמש...</div>;
  }

  return (
    <div className={styles.scannerContainer}>
      <h1 className={styles.title}>סריקת מוצרי מזון</h1>
      
      <AllergenManagement />

      <div className={styles.scannerSection}>
        <button 
          className={styles.toggleScannerButton} 
          onClick={() => setIsScannerActive(!isScannerActive)}
        >
          {isScannerActive ? <FaToggleOn /> : <FaToggleOff />}
          {isScannerActive ? ' כבה סורק' : ' הפעל סורק'}
        </button>
        
        {isScannerActive && (
          <div className={styles.scannerActive}>
            <BarcodeReader
              onError={handleError}
              onScan={handleScan}
            />
            <div className={styles.scannerOverlay}>
              <div className={styles.scannerLine}></div>
            </div>
          </div>
        )}
        
        <p className={styles.instructions}>
          <FaBarcode /> {isScannerActive ? 'מקם את הברקוד מול המצלמה לסריקה' : 'הפעל את הסורק כדי לסרוק מוצר'}
        </p>
      </div>

      <div className={styles.manualSection}>
        <form onSubmit={handleManualSubmit}>
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="הזן קוד ברקוד ידנית"
            className={styles.manualInput}
          />
          <button type="submit" className={styles.submitButton}>
            <FaSearch /> חפש
          </button>
        </form>
      </div>

      {isLoading && <p className={styles.loading}>טוען מידע על המוצר...</p>}
      {error && <p className={styles.error}>שגיאה בטעינת מידע המוצר</p>}
      
      {renderProductInfo()}

      <div className={styles.historySection}>
        <h3><FaHistory /> היסטוריית סריקות</h3>
        <ul>
          {scanHistory.map((item, index) => (
            <li key={index} className={styles.historyItem}>
              {item.name} - {new Date(item.scannedAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EnhancedFoodScanner;