// Accessible Modal Component - WCAG 2.1 AA Compliance
// Modal dialog with proper focus management, ARIA attributes, and keyboard handling

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from '../FocusTrap/FocusTrap';
import { useAnnouncement } from '../ScreenReader/ScreenReader';
import AccessibleButton from '../AccessibleButton/AccessibleButton';
import { KEYBOARD_KEYS, ARIA_LABELS } from '../../../utils/accessibilityUtils';
import './AccessibleModal.module.css';

const AccessibleModal = ({
  isOpen = false,
  onClose,
  title,
  description,
  children,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  initialFocus,
  finalFocus,
  role = 'dialog',
  ariaModal = true,
  ...props
}) => {
  const { announce } = useAnnouncement();
  const modalRef = useRef(null);
  const titleId = useRef(`modal-title-${Date.now()}`);
  const descriptionId = useRef(`modal-desc-${Date.now()}`);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
      announce('Dialog closed', 'polite');
    }
  }, [onClose, announce]);

  const handleOverlayClick = useCallback((event) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      handleClose();
    }
  }, [closeOnOverlayClick, handleClose]);

  const handleEscapeKey = useCallback((event) => {
    if (event.key === KEYBOARD_KEYS.ESCAPE && closeOnEscape) {
      handleClose();
    }
  }, [closeOnEscape, handleClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      // Announce modal opening
      announce(`Dialog opened: ${title || 'Modal dialog'}`, 'polite');
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen, title, announce]);

  // Handle keyboard events
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) return null;

  const modalClasses = [
    'accessible-modal',
    `accessible-modal--${size}`,
    className
  ].filter(Boolean).join(' ');

  const overlayClasses = [
    'accessible-modal__overlay',
    overlayClassName
  ].filter(Boolean).join(' ');

  const contentClasses = [
    'accessible-modal__content',
    contentClassName
  ].filter(Boolean).join(' ');

  const ariaProps = {
    role,
    'aria-modal': ariaModal,
    'aria-labelledby': title ? titleId.current : undefined,
    'aria-describedby': description ? descriptionId.current : undefined
  };

  const modalContent = (
    <div className={overlayClasses} onClick={handleOverlayClick}>
      <FocusTrap
        isActive={isOpen}
        onEscape={handleClose}
        className={modalClasses}
      >
        <div
          ref={modalRef}
          className={contentClasses}
          {...ariaProps}
          {...props}
        >
          {/* Modal Header */}
          {(title || showCloseButton) && (
            <header className="accessible-modal__header">
              {title && (
                <h2
                  id={titleId.current}
                  className="accessible-modal__title"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <AccessibleButton
                  variant="ghost"
                  size="small"
                  onClick={handleClose}
                  ariaLabel={ARIA_LABELS.close}
                  className="accessible-modal__close-button"
                >
                  <span aria-hidden="true">&times;</span>
                </AccessibleButton>
              )}
            </header>
          )}

          {/* Modal Body */}
          <div className="accessible-modal__body">
            {description && (
              <p
                id={descriptionId.current}
                className="accessible-modal__description"
              >
                {description}
              </p>
            )}
            {children}
          </div>
        </div>
      </FocusTrap>
    </div>
  );

  // Render modal in a portal
  const modalRoot = document.getElementById('modal-root') || document.body;
  return createPortal(modalContent, modalRoot);
};

// Modal Context for managing multiple modals
export const ModalContext = React.createContext({
  openModals: [],
  openModal: () => {},
  closeModal: () => {},
  closeAllModals: () => {}
});

export const ModalProvider = ({ children }) => {
  const [openModals, setOpenModals] = React.useState([]);

  const openModal = useCallback((modalId) => {
    setOpenModals(prev => [...prev, modalId]);
  }, []);

  const closeModal = useCallback((modalId) => {
    setOpenModals(prev => prev.filter(id => id !== modalId));
  }, []);

  const closeAllModals = useCallback(() => {
    setOpenModals([]);
  }, []);

  const value = {
    openModals,
    openModal,
    closeModal,
    closeAllModals
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {/* Create modal root if it doesn't exist */}
      {typeof document !== 'undefined' && !document.getElementById('modal-root') && (
        <div id="modal-root" />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export default AccessibleModal;