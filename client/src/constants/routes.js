import React from 'react';
import Home from '../pages/home/Home.jsx';
import RecipeList from '../pages/recipeList/RecipeList.jsx';
import AddRecipe from '../pages/addRecipe/AddRecipe';
import Register from '../pages/auth/Register.jsx';
import Login from '../pages/auth/Login';
import UserProfile from '../pages/userProfile/UserProfile';
import MyRecipes from '../pages/myRecipes/MyRecipes.jsx';
import RecipeDetails from '../pages/recipeDetails/RecipeDetails.jsx';
import UserSettings from '../pages/useSettings/UserSettings';
import FavoritesPage from '../pages/favoritePage/FavoritesPage';
import AllergyInfo from '../pages/allergyInfo/AllergyInfo';
import Forum from '../pages/forum/Forum';
import FoodScanner from '../pages/foodScanner/FoodScanner';

const routes = [
  { path: '/', element: <Home />, isPrivate: false },
  { path: '/recipes', element: <RecipeList />, isPrivate: false },
  { path: '/recipe/:id', element: <RecipeDetails />, isPrivate: false },
  { path: '/register', element: <Register />, isPrivate: false },
  { path: '/login', element: <Login />, isPrivate: false },
  { path: '/add-recipe', element: <AddRecipe />, isPrivate: true },
  { path: '/profile', element: <UserProfile />, isPrivate: true },
  { path: '/my-recipes', element: <MyRecipes />, isPrivate: true },
  { path: '/settings', element: <UserSettings />, isPrivate: true },
  { path: '/favorites', element: <FavoritesPage />, isPrivate: true },
  { path: '/food-scanner', element: <FoodScanner />, isPrivate: false },
  { path: '/allergy-info', element: <AllergyInfo />, isPrivate: false },
  { path: '/allergy-info/:allergenId', element: <AllergyInfo />, isPrivate: false },
  { path: '/forum', element: <Forum />, isPrivate: false },
];

export default routes;