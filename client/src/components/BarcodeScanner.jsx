import React, { useEffect, useRef, useState } from 'react';
import Quagga from '@ericblade/quagga2';
import styles from './BarcodeScanner.module.css';

const BarcodeScanner = ({ onScan, onClose }) => {
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              width: 480,
              height: 320,
              facingMode: "environment"
            },
            target: scannerRef.current
          },
          decoder: {
            readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader"],
          },
          locate: true
        },
        function (err) {
          if (err) {
            console.error("Quagga initialization failed", err);
            setError("Failed to initialize the scanner. Please make sure you've given camera permissions.");
            return;
          }
          console.log("Quagga initialization succeeded");
          Quagga.start();
        }
      );

      Quagga.onDetected((data) => {
        console.log("Barcode detected", data);
        onScan(data.codeResult.code);
      });

      Quagga.onProcessed((result) => {
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            result.boxes.filter((box) => box !== result.box).forEach((box) => {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
            });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
          }
        }
      });

    }

    return () => {
      Quagga.stop();
    };
  }, [onScan]);

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setError(null);
      // Reinitialize Quagga here
    } catch (err) {
      console.error("Failed to get camera permission", err);
      setError("Camera access denied. Please enable camera access and try again.");
    }
  };

  return (
    <div className={styles.scannerContainer}>
      {error ? (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={requestCameraPermission} className={styles.retryButton}>
            Retry
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