import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';

export const useRecipeList = (recipesPerPage) => {
  const dispatch = useDispatch();
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({});

  const fetchRecipesQuery = useCallback(async ({ page, params }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await dispatch(fetchRecipes({ 
        page, 
        limit: recipesPerPage, 
        ...params,
        allergens: params.allergens?.join(',')
      })).unwrap();
      return result;
    } catch (error) {
      setError(error.message || 'שגיאה בטעינת המתכונים');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, recipesPerPage]);

  const handleSearch = useCallback((params) => {
    setSearchParams(params);
    setPage(1);
    setRecipes([]);
    setHasMore(true);
  }, []);

  const fetchNextPage = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchRecipesQuery({ page, params: searchParams });
      if (result) {
        setRecipes(prevRecipes => [...prevRecipes, ...result.recipes]);
        setHasMore(result.recipes.length === recipesPerPage);
      }
    };
    fetchData();
  }, [page, searchParams, fetchRecipesQuery, recipesPerPage]);

  return {
    recipes,
    hasMore,
    isLoading,
    error,
    handleSearch,
    fetchNextPage,
  };
};