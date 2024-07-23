import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import api from '../services/api';
import { useToast } from '../components/Toast';
import BarcodeScanner from '../components/BarcodeScanner';
import ProductInfo from '../components/ProductInfo';
import AddProductForm from '../components/AddProductForm';
import styles from './FoodScanner.module.css';

const FoodScanner = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [manualCode, setManualCode] = useState('');
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: productInfo, isLoading, error } = useQuery(
    ['product', scannedCode],
    async () => {
      if (!scannedCode) return null;
      
      try {
        const localResponse = await api.get(`/products/${scannedCode}`);
        if (localResponse.data) return localResponse.data;
      } catch (err) {
        if (err.response && err.response.status !== 404) throw err;
      }
      
      const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${scannedCode}.json`);
      if (response.data.status === 1) return response.data.product;
      
      return null;
    },
    {
      enabled: !!scannedCode,
      onError: (err) => {
        addToast(`שגיאה בטעינת מידע על המוצר: ${err.message}`, 'error');
      },
      onSuccess: (data) => {
        if (data) {
          addToast('מידע על המוצר נטען בהצלחה', 'success');
          updateScanHistory(scannedCode, data.product_name);
        } else {
          addToast('מוצר לא נמצא במאגר', 'info');
        }
      }
    }
  );

  const addProductMutation = useMutation(
    (newProduct) => api.post('/products', newProduct),
    {
      onSuccess: () => {
        addToast('המוצר נוסף בהצלחה', 'success');
        queryClient.invalidateQueries(['product', scannedCode]);
        setIsAddingProduct(false);
      },
      onError: (err) => {
        addToast(`שגיאה בהוספת המוצר: ${err.message}`, 'error');
      },
    }
  );

  const handleScan = useCallback((barcode) => {
    setScannedCode(barcode);
  }, []);

  const handleAddProduct = (productData) => {
    addProductMutation.mutate({ ...productData, barcode: scannedCode });
  };

  const updateScanHistory = (code, name) => {
    setScanHistory(prev => {
      const newHistory = [{ code, name, timestamp: new Date() }, ...prev];
      return newHistory.slice(0, 10); // שמור רק 10 פריטים אחרונים
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setScannedCode(manualCode);
    setManualCode('');
  };

  useEffect(() => {
    if (productInfo) {
      updateScanHistory(scannedCode, productInfo.product_name);
    }
  }, [productInfo, scannedCode]);

  return (
    <div className={styles.scannerContainer}>
      <h2>סורק ברקודים למוצרי מזון</h2>
      
      <button onClick={() => setIsScannerActive(!isScannerActive)}>
        {isScannerActive ? 'כבה סורק' : 'הפעל סורק'}
      </button>
      
      {isScannerActive && <BarcodeScanner onScan={handleScan} />}
      
      <form onSubmit={handleManualSubmit} className={styles.manualInput}>
        <input
          type="text"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="הכנס ברקוד ידנית"
        />
        <button type="submit">חפש</button>
      </form>

      {isLoading && <p>טוען מידע על המוצר...</p>}
      {error && <p>שגיאה בטעינת מידע על המוצר</p>}
      {productInfo && <ProductInfo product={productInfo} />}
      {!productInfo && scannedCode && !isLoading && (
        <>
          <p>מוצר לא נמצא. האם תרצה להוסיף אותו?</p>
          <button onClick={() => setIsAddingProduct(true)}>הוסף מוצר חדש</button>
        </>
      )}
      {isAddingProduct && (
        <AddProductForm 
          onSubmit={handleAddProduct} 
          onCancel={() => setIsAddingProduct(false)} 
        />
      )}

      <div className={styles.scanHistory}>
        <h3>היסטוריית סריקות</h3>
        <ul>
          {scanHistory.map((item, index) => (
            <li key={index}>
              {item.name} (ברקוד: {item.code}) - {new Date(item.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FoodScanner;