// Screen Reader Announcements Component
// Provides live region for screen reader announcements

import React, { forwardRef } from 'react';
import './ScreenReader.module.css';

const ScreenReader = forwardRef(({ 
  level = 'polite',
  atomic = true,
  relevant = 'additions text',
  className = '',
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`sr-announcement ${className}`}
      aria-live={level}
      aria-atomic={atomic}
      aria-relevant={relevant}
      role={level === 'assertive' ? 'alert' : 'status'}
      {...props}
    >
      {children}
    </div>
  );
});

ScreenReader.displayName = 'ScreenReader';

// Hook for easy screen reader announcements
export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = React.useState('');
  const [level, setLevel] = React.useState('polite');

  const announce = React.useCallback((message, priority = 'polite') => {
    setLevel(priority);
    setAnnouncement(message);
    
    // Clear announcement after a delay to allow for re-announcements
    setTimeout(() => {
      setAnnouncement('');
    }, 1000);
  }, []);

  const AnnouncementComponent = React.useCallback(() => (
    <ScreenReader level={level}>
      {announcement}
    </ScreenReader>
  ), [announcement, level]);

  return { announce, AnnouncementComponent };
};

export default ScreenReader;