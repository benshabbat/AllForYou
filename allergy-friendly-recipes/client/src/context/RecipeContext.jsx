import React, { createContext, useContext, useReducer } from 'react';

const RecipeContext = createContext();

const initialState = {
  recipes: [],
  filter: [],
  loading: false,
  error: null
};

function recipeReducer(state, action) {
  switch (action.type) {
    case 'SET_RECIPES':
      return { ...state, recipes: action.payload, loading: false };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'ADD_RECIPE':
      return { ...state, recipes: [...state.recipes, action.payload] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export const RecipeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => useContext(RecipeContext);