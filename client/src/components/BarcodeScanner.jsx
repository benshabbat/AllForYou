import React, { useEffect, useRef, useState, useCallback } from 'react';
import Quagga from '@ericblade/quagga2';
import PropTypes from 'prop-types';
import styles from './BarcodeScanner.module.css';

/**
 * BarcodeScanner component for scanning barcodes using device camera.
 * 
 * @param {Object} props
 * @param {Function} props.onScan - Callback function when barcode is detected
 * @param {Function} props.onClose - Callback function to close the scanner
 */
const BarcodeScanner = ({ onScan, onClose }) => {
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const scannerRef = useRef(null);

  const initializeScanner = useCallback(async () => {
    if (!scannerRef.current) {
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
    }
  }, [onScan]);

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

  const retryInitialization = useCallback(() => {
    setError(null);
    setIsInitialized(false);
    initializeScanner();
  }, [initializeScanner]);

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
            <div className={styles.scannerLine} aria-hidden="true"></div>
          </div>
        </div>
      )}
      <button onClick={onClose} className={styles.closeButton} aria-label="סגור סורק">סגור</button>
    </div>
  );
};

BarcodeScanner.propTypes = {
  onScan: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default React.memo(BarcodeScanner);