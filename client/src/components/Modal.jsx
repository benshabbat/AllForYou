import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, children, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.modalContent}>
          {children}
        </div>
        {onConfirm && (
          <div className={styles.modalFooter}>
            <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={onClose}>ביטול</button>
            <button className={`${styles.modalButton} ${styles.confirmButton}`} onClick={onConfirm}>אישור</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;