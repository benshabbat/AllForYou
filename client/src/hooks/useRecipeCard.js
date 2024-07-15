import { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { fetchRecipes } from '../store/slices/recipeSlice';

const initialSearchParams = {};

export const useRecipeList = (recipesPerPage) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState(initialSearchParams);

  const fetchRecipesQuery = useCallback(async ({ page, params }) => {
    try {
      const queryParams = {
        page,
        limit: recipesPerPage,
        ...params,
        allergens: params.allergens?.join(','),
      };
      return await dispatch(fetchRecipes(queryParams)).unwrap();
    } catch (error) {
      throw new Error(error.message || 'שגיאה בטעינת המתכונים');
    }
  }, [dispatch, recipesPerPage]);

  const queryKey = ['recipes', currentPage, searchParams];
  const queryFn = () => fetchRecipesQuery({ page: currentPage, params: searchParams });

  const { data, isLoading, error } = useQuery(queryKey, queryFn, {
    keepPreviousData: true,
  });

  const handleSearch = useCallback((params) => {
    setSearchParams(params);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback(setCurrentPage, []);

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