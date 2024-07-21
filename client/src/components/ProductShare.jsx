import React from 'react';
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import styles from './ProductShare.module.css';

const ProductShare = ({ product }) => {
  const shareUrl = `https://yourapp.com/product/${product._id}`;
  const shareText = `בדקו את המוצר הזה: ${product.name} מ-${product.manufacturer}`;

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  return (
    <div className={styles.shareContainer}>
      <h4>שתף מוצר זה</h4>
      <div className={styles.shareButtons}>
        <button onClick={shareFacebook} className={styles.shareButton} aria-label="שתף בפייסבוק">
          <FaFacebook />
        </button>
        <button onClick={shareTwitter} className={styles.shareButton} aria-label="שתף בטוויטר">
          <FaTwitter />
        </button>
        <button onClick={shareWhatsapp} className={styles.shareButton} aria-label="שתף בוואטסאפ">
          <FaWhatsapp />
        </button>
      </div>
    </div>
  );
};

export default ProductShare;