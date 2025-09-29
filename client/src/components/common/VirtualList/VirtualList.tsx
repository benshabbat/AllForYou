import React, { useState, useRef, useCallback, useMemo } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import styles from './VirtualList.module.css';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  className?: string;
  renderItem: (props: { item: T; index: number; style: React.CSSProperties }) => React.ReactElement;
  onEndReached?: () => void;
  threshold?: number;
  isLoading?: boolean;
  loadingComponent?: React.ComponentType;
  emptyComponent?: React.ComponentType;
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
    className = '',
    renderItem,
    onEndReached,
    threshold = 0.8,
    isLoading = false,
    loadingComponent: LoadingComponent = DefaultLoadingComponent,
    emptyComponent: EmptyComponent = DefaultEmptyComponent,
  } = props;

  const listRef = useRef<List>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Handle infinite scroll
  const handleItemsRendered = useCallback(
    ({ visibleStopIndex }: { visibleStopIndex: number }) => {
      if (
        !isLoading &&
        onEndReached &&
        visibleStopIndex >= items.length * threshold
      ) {
        onEndReached();
      }
    },
    [items.length, onEndReached, threshold, isLoading]
  );

  // Handle scroll
  const handleScroll = useCallback(
    ({ scrollTop: newScrollTop }: { scrollTop: number }) => {
      setScrollTop(newScrollTop);
    },
    []
  );

  // Scroll to top method
  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToItem(0);
  }, []);

  // Memoize the item data to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    items,
    renderItem,
  }), [items, renderItem]);

  // Show empty state
  if (items.length === 0 && !isLoading) {
    return <EmptyComponent />;
  }

  const ItemRenderer = ({ index, style, data }: ListChildComponentProps) => {
    const item = data.items[index];
    if (!item) return null;
    
    return data.renderItem({ item, index, style });
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            width={width}
            itemCount={items.length}
            itemSize={itemHeight}
            itemData={itemData}
            onItemsRendered={handleItemsRendered}
            onScroll={handleScroll}
            className={styles.list}
          >
            {ItemRenderer}
          </List>
        )}
      </AutoSizer>
      
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