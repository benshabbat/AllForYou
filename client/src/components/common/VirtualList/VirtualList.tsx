import React, { useState, useRef, useCallback, useMemo } from 'react';
import styles from './VirtualList.module.css';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight?: number;
  className?: string;
  renderItem: (item: T, index: number) => React.ReactElement;
  onEndReached?: () => void;
  threshold?: number;
  isLoading?: boolean;
  loadingComponent?: React.ComponentType;
  emptyComponent?: React.ComponentType;
  overscan?: number;
}

// Default loading component
const DefaultLoadingComponent: React.FC = () => (
  <div className={styles.loading}>
    <div className={styles.spinner} />
    <span>טוען...</span>
  </div>
);

// Default empty component
const DefaultEmptyComponent: React.FC = () => (
  <div className={styles.empty}>
    <div className={styles.emptyIcon}>📭</div>
    <p>אין פריטים להצגה</p>
  </div>
);

function VirtualList<T>(props: VirtualListProps<T>) {
  const {
    items,
    itemHeight,
    containerHeight = 400,
    className = '',
    renderItem,
    onEndReached,
    threshold = 0.8,
    isLoading = false,
    loadingComponent: LoadingComponent = DefaultLoadingComponent,
    emptyComponent: EmptyComponent = DefaultEmptyComponent,
    overscan = 5,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);
    
    return { startIndex, endIndex, visibleCount };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);

    // Check if we need to load more items
    if (onEndReached && !isLoading) {
      const scrollBottom = newScrollTop + containerHeight;
      const totalHeight = items.length * itemHeight;
      
      if (scrollBottom >= totalHeight * threshold) {
        onEndReached();
      }
    }
  }, [onEndReached, isLoading, containerHeight, items.length, itemHeight, threshold]);

  // Scroll to top method
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // Scroll to specific item
  const scrollToItem = useCallback((index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = index * itemHeight;
    }
  }, [itemHeight]);

  // Render visible items
  const visibleItems = useMemo(() => {
    const items_to_render = [];
    
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      const item = items[i];
      if (!item) continue;

      const style: React.CSSProperties = {
        position: 'absolute',
        top: i * itemHeight,
        left: 0,
        right: 0,
        height: itemHeight,
      };

      items_to_render.push(
        <div key={i} style={style} className={styles.virtualItem}>
          {renderItem(item, i)}
        </div>
      );
    }
    
    return items_to_render;
  }, [visibleRange, items, itemHeight, renderItem]);

  // Show empty state
  if (items.length === 0 && !isLoading) {
    return <EmptyComponent />;
  }

  const totalHeight = items.length * itemHeight;

  return (
    <div className={`${styles.container} ${className}`}>
      <div
        ref={containerRef}
        className={styles.viewport}
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div
          className={styles.virtualContent}
          style={{ height: totalHeight, position: 'relative' }}
        >
          {visibleItems}
        </div>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <LoadingComponent />
        </div>
      )}
      
      {/* Scroll to top button */}
      {scrollTop > 200 && (
        <button
          className={styles.scrollToTop}
          onClick={scrollToTop}
          aria-label="חזור לראש הרשימה"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default VirtualList;