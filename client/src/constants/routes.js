import React from 'react';
import Home from '../pages/home/Home.jsx';
import RecipeList from '../pages/recipeList/RecipeList.jsx';
import AddRecipe from '../pages/addRecipe/AddRecipe.jsx';
import Register from '../pages/auth/Register.jsx';
import Login from '../pages/auth/Login.jsx';
import UserProfile from '../pages/userProfile/UserProfile.jsx';
import MyRecipes from '../pages/myRecipes/MyRecipes.jsx';
import RecipeDetails from '../pages/recipeDetails/RecipeDetails.jsx';
import UserSettings from '../pages/useSettings/UserSettings.jsx';
import FavoritesPage from '../pages/favoritePage/FavoritesPage.jsx';
import AllergyInfo from '../pages/allergyInfo/AllergyInfo.jsx';
import Forum from '../pages/forum/Forum.jsx';
import FoodScanner from '../pages/foodScanner/FoodScanner.jsx';

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