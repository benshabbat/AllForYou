import React, { useState, useEffect, ImgHTMLAttributes } from 'react';
import styles from './LazyImage.module.css';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  placeholderSrc?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  blur?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  placeholderSrc,
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  fallbackSrc,
  blur = true,
  className,
  alt,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholderSrc || '');
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Preload the actual image once it's in viewport
  useEffect(() => {
    if (!isIntersecting || !src) return;

    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    
    imageLoader.onerror = () => {
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
        setIsLoaded(true);
      } else {
        setIsError(true);
      }
      onError?.();
    };
    
    imageLoader.src = src;
    
    return () => {
      imageLoader.onload = null;
      imageLoader.onerror = null;
    };
  }, [isIntersecting, src, fallbackSrc, onLoad, onError]);

  // Intersection Observer setup
  useEffect(() => {
    if (!imageRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(imageRef);

    return () => observer.disconnect();
  }, [imageRef, threshold, rootMargin]);

  const handleImageRef = (node: HTMLImageElement | null) => {
    setImageRef(node);
  };

  if (isError && !fallbackSrc) {
    return (
      <div 
        className={`${styles.errorPlaceholder} ${className || ''}`}
        {...props}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          className={styles.errorIcon}
        >
          <path 
            d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" 
            fill="currentColor"
          />
        </svg>
        <span className={styles.errorText}>תמונה לא זמינה</span>
      </div>
    );
  }

  return (
    <img
      ref={handleImageRef}
      src={imageSrc}
      alt={alt}
      className={`
        ${styles.lazyImage}
        ${blur && !isLoaded ? styles.blurred : ''}
        ${isLoaded ? styles.loaded : ''}
        ${className || ''}
      `}
      {...props}
    />
  );
};

export default LazyImage;