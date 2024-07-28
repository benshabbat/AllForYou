import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { fetchProductByBarcode, createProduct, addToScanHistory, fetchScanHistory } from '../utils/apiUtils';
import {useToast} from '../components/common/toast/Toast';
import BarcodeScanner from '../components/BarcodeScanner';
import ProductInfo from '../components/ProductInfo';
import AddProductForm from '../components/AddProductForm';
import {Loading} from '../components/common';
import ErrorMessage from '../components/ErrorMessage';
import styles from './FoodScanner.module.css';

const FoodScanner = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: productInfo, isLoading, error } = useQuery(
    ['product', scannedCode],
    async () => {
      if (!scannedCode) return null;
      
      try {
        const localProduct = await fetchProductByBarcode(scannedCode);
        if (localProduct) return localProduct;
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
          addToScanHistory(scannedCode, data.product_name);
        } else {
          addToast('מוצר לא נמצא במאגר', 'info');
        }
      }
    }
  );

  const { data: scanHistory } = useQuery('scanHistory', fetchScanHistory);

  const addProductMutation = useMutation(createProduct, {
    onSuccess: () => {
      addToast('המוצר נוסף בהצלחה', 'success');
      queryClient.invalidateQueries(['product', scannedCode]);
      setIsAddingProduct(false);
    },
    onError: (err) => {
      addToast(`שגיאה בהוספת המוצר: ${err.message}`, 'error');
    },
  });

  const handleScan = useCallback((barcode) => {
    setScannedCode(barcode);
  }, []);

  const handleAddProduct = useCallback((productData) => {
    addProductMutation.mutate({ ...productData, barcode: scannedCode });
  }, [addProductMutation, scannedCode]);

  const handleManualSubmit = useCallback((e) => {
    e.preventDefault();
    setScannedCode(manualCode);
    setManualCode('');
  }, [manualCode]);

  const renderScannerControls = () => (
    <>
      <button onClick={() => setIsScannerActive(!isScannerActive)} className={styles.toggleButton}>
        {isScannerActive ? 'כבה סורק' : 'הפעל סורק'}
      </button>
      
      {isScannerActive && <BarcodeScanner onScan={handleScan} />}
    </>
  );

  const renderManualInput = () => (
    <form onSubmit={handleManualSubmit} className={styles.manualInput}>
      <input
        type="text"
        value={manualCode}
        onChange={(e) => setManualCode(e.target.value)}
        placeholder="הכנס ברקוד ידנית"
      />
      <button type="submit">חפש</button>
    </form>
  );

  const renderProductInfo = () => {
    if (isLoading) return <Loading message="טוען מידע על המוצר..." />;
    if (error) return <ErrorMessage message="שגיאה בטעינת מידע על המוצר" />;
    if (productInfo) return <ProductInfo product={productInfo} />;
    if (scannedCode && !isLoading) {
      return (
        <>
          <p>מוצר לא נמצא. האם תרצה להוסיף אותו?</p>
          <button onClick={() => setIsAddingProduct(true)}>הוסף מוצר חדש</button>
        </>
      );
    }
    return null;
  };

  const renderScanHistory = () => (
    <div className={styles.scanHistory}>
      <h3>היסטוריית סריקות</h3>
      <ul>
        {scanHistory?.map((item, index) => (
          <li key={index}>
            {item.productName} (ברקוד: {item.productCode}) - {new Date(item.scannedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={styles.scannerContainer}>
      <h2>סורק ברקודים למוצרי מזון</h2>
      
      {renderScannerControls()}
      {renderManualInput()}
      {renderProductInfo()}
      
      {isAddingProduct && (
        <AddProductForm 
          onSubmit={handleAddProduct} 
          onCancel={() => setIsAddingProduct(false)} 
        />
      )}

      {renderScanHistory()}
    </div>
  );
};

export default React.memo(FoodScanner);