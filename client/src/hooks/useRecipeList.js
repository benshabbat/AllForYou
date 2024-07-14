import { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { fetchRecipes } from '../store/slices/recipeSlice';

// interface Recipe {
//   _id: string;
//   // Add other recipe properties here
// }

// interface SearchParams {
//   // Define the structure of your search params
// }

export const useRecipeList = (recipesPerPage) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({});

  const fetchRecipesQuery = useCallback(async ({ page, params }) => {
    try {
      const result = await dispatch(fetchRecipes({ 
        page, 
        limit: recipesPerPage, 
        ...params,
        allergens: params.allergens?.join(',')
      })).unwrap();
      return result;
    } catch (error) {
      throw new Error(error.message || 'שגיאה בטעינת המתכונים');
    }
  }, [dispatch, recipesPerPage]);

  const { data, isLoading, error } = useQuery(
    ['recipes', currentPage, searchParams],
    () => fetchRecipesQuery({ page: currentPage, params: searchParams }),
    { keepPreviousData: true }
  );

  const handleSearch = useCallback((params) => {
    setSearchParams(params);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const recipes = useMemo(() => data?.recipes || [], [data]);
  const totalRecipes = useMemo(() => data?.totalRecipes || 0, [data]);

  return {
    recipes,
    totalRecipes,
    currentPage,
    isLoading,
    error,
    handleSearch,
    handlePageChange,
  };
};