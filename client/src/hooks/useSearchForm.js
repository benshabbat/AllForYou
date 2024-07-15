import { useState, useCallback } from 'react';

const initialSearchParams = {
  keyword: '',
  category: '',
  allergens: [],
  difficulty: '',
};

export const useSearchForm = (onSearch) => {
  const [searchParams, setSearchParams] = useState(initialSearchParams);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleAllergenToggle = useCallback((allergenId) => {
    setSearchParams(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergenId)
        ? prev.allergens.filter(id => id !== allergenId)
        : [...prev.allergens, allergenId]
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSearch(searchParams);
  }, [onSearch, searchParams]);

  return {
    searchParams,
    handleChange,
    handleAllergenToggle,
    handleSubmit
  };
};