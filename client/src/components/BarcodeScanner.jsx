import React, { useEffect, useRef, useState, useCallback } from 'react';
import Quagga from '@ericblade/quagga2';
import styles from './BarcodeScanner.module.css';

const BarcodeScanner = ({ onScan, onError, onClose }) => {
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeScanner = useCallback(async () => {
    if (!scannerRef.current) {
      console.error("Scanner ref is not available");
      setError("Scanner element is not available");
      return;
    }

    try {
      await Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              width: { min: 450 },
              height: { min: 300 },
              facingMode: "environment",
              aspectRatio: { min: 1, max: 2 }
            },
            target: scannerRef.current
          },
          locator: {
            patchSize: "medium",
            halfSample: true
          },
          numOfWorkers: 2,
          decoder: {
            readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader"]
          },
          locate: true
        },
        (err) => {
          if (err) {
            console.error("Quagga initialization failed", err);
            setError(`Failed to initialize the scanner: ${err.message}`);
            onError(err);
            return;
          }
          console.log("Quagga initialization succeeded");
          Quagga.start();
          setIsInitialized(true);
        }
      );

      Quagga.onDetected((result) => {
        console.log("Barcode detected", result);
        onScan(result.codeResult.code);
      });

    } catch (err) {
      console.error("Quagga initialization failed", err);
      setError(`Failed to initialize the scanner: ${err.message}`);
      onError(err);
    }
  }, [onScan, onError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeScanner();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (isInitialized) {
        Quagga.stop();
      }
    };
  }, [initializeScanner, isInitialized]);

  const retryInitialization = () => {
    setError(null);
    setIsInitialized(false);
    initializeScanner();
  };

  return (
    <div className={styles.scannerContainer}>
      {error ? (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={retryInitialization} className={styles.retryButton}>
            נסה שוב
          </button>
        </div>
      ) : (
        <div ref={scannerRef} className={styles.scanner}>
          <div className={styles.scannerOverlay}>
            <div className={styles.scannerLine}></div>
          </div>
        </div>
      )}
      <button onClick={onClose} className={styles.closeButton}>סגור</button>
    </div>
  );
};

export default BarcodeScanner;