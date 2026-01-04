import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../constants/appConstants';

/**
 * Custom hook to detect screen size and breakpoints
 * @returns {Object} Screen size information
 */
export const useMediaQuery = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });

      // Determine breakpoint
      if (width < BREAKPOINTS.MOBILE_L) {
        setBreakpoint('mobile');
      } else if (width < BREAKPOINTS.TABLET) {
        setBreakpoint('mobile-l');
      } else if (width < BREAKPOINTS.LAPTOP) {
        setBreakpoint('tablet');
      } else if (width < BREAKPOINTS.DESKTOP) {
        setBreakpoint('laptop');
      } else if (width < BREAKPOINTS.WIDE) {
        setBreakpoint('desktop');
      } else {
        setBreakpoint('wide');
      }
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...screenSize,
    breakpoint,
    isMobile: screenSize.width < BREAKPOINTS.MOBILE_L,
    isTablet: screenSize.width >= BREAKPOINTS.MOBILE_L && screenSize.width < BREAKPOINTS.LAPTOP,
    isDesktop: screenSize.width >= BREAKPOINTS.LAPTOP,
    isWide: screenSize.width >= BREAKPOINTS.WIDE,
  };
};

/**
 * Hook to check if a media query matches
 * @param {string} query - CSS media query
 * @returns {boolean} Whether the query matches
 */
export const useMediaQueryMatch = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const handleChange = (e) => setMatches(e.matches);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;
