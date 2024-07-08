import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { fetchRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import AdvancedSearch from '../components/AdvancedSearch';
import styles from './RecipeList.module.css';

const RECIPES_PER_PAGE = 12;

const RecipeList = () => {
  const dispatch = useDispatch();
  const { recipes, isLoading, error } = useSelector((state) => state.recipes);

  const fetchRecipesData = useCallback(() => {
    dispatch(fetchRecipes({ page: 1, limit: RECIPES_PER_PAGE }));
  }, [dispatch]);

  useEffect(() => {
    fetchRecipesData();
  }, [fetchRecipesData]);

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 3 + columnIndex;
    if (index >= recipes.length) return null;
    const recipe = recipes[index];
    return (
      <div style={style}>
        <RecipeCard recipe={recipe} />
      </div>
    );
  };

  if (isLoading) return <div className={styles.loading}>טוען מתכונים...</div>;
  if (error) return <div className={styles.error}>שגיאה: {error}</div>;
  if (!recipes || recipes.length === 0) return <div className={styles.noRecipes}>לא נמצאו מתכונים.</div>;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>המתכונים שלנו</h1>
      <AdvancedSearch onSearch={fetchRecipesData} />
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            className={styles.recipeGrid}
            columnCount={3}
            columnWidth={width / 3}
            height={height}
            rowCount={Math.ceil(recipes.length / 3)}
            rowHeight={350}
            width={width}
          >
            {Cell}
          </Grid>
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(RecipeList);