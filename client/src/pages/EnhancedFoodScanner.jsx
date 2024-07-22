import React, { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import api from '../services/api';
import { useToast } from '../components/Toast';
import BarcodeScanner from '../components/BarcodeScanner';
import ProductInfo from '../components/ProductInfo';
import AddProductForm from '../components/AddProductForm';
import styles from './EnhancedFoodScanner.module.css';

const EnhancedFoodScanner = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [productInfo, setProductInfo] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const getProductInfo = async (barcode) => {
    try {
      const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      if (response.data.status === 1) {
        return response.data.product;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching product info:', error);
      return null;
    }
  };

  const { mutate: addProductMutation } = useMutation(
    (newProduct) => api.post('/products', newProduct),
    {
      onSuccess: () => {
        addToast('המוצר נוסף בהצלחה', 'success');
        queryClient.invalidateQueries('scanHistory');
        setIsAddingProduct(false);
      },
      onError: () => {
        addToast('שגיאה בהוספת המוצר', 'error');
      },
    }
  );

  const handleScan = useCallback(async (barcode) => {
    setScannedCode(barcode);
    const product = await getProductInfo(barcode);
    if (product) {
      setProductInfo(product);
    } else {
      setProductInfo(null);
      setIsAddingProduct(true);
    }
  }, []);

  const handleAddProduct = (productData) => {
    addProductMutation({ ...productData, barcode: scannedCode });
  };

  return (
    <div className={styles.scannerContainer}>
      <h2>סורק ברקודים למוצרי מזון</h2>
      <BarcodeScanner onScan={handleScan} />
      {productInfo && <ProductInfo product={productInfo} />}
      {isAddingProduct && (
        <AddProductForm 
          onSubmit={handleAddProduct} 
          onCancel={() => setIsAddingProduct(false)} 
        />
      )}
    </div>
  );
};

export default EnhancedFoodScanner;