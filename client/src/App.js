import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { QueryClient, QueryClientProvider, useQueryClient } from 'react-query';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { store } from './store/index.js';
import { loadUser, setInitialized } from './store/auth/authSlice';
import Header from './components/layout/header/Header';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import { useAuth } from './hooks/useAuth';
import {Loading, ErrorBoundary,ToastProvider, ToastContainer } from './components/common';
import api from './services/api';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const RecipeList = lazy(() => import('./pages/RecipeList'));
const RecipeForm = lazy(() => import('./pages/AddRecipe'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const MyRecipes = lazy(() => import('./pages/MyRecipes'));
const RecipeDetails = lazy(() => import('./pages/RecipeDetails'));
const UserSettings = lazy(() => import('./pages/UserSettings'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const AllergyInfo = lazy(() => import('./pages/AllergyInfo'));
const Forum = lazy(() => import('./pages/Forum'));
const EnhancedFoodScanner = lazy(() => import('./pages/FoodScanner'));

const queryClient = new QueryClient();

/**
 * Main content component of the application.
 * Handles routing and authentication initialization.
 */
function AppContent() {
  const dispatch = useDispatch();
  const { isLoading } = useAuth();
  const location = useLocation();
  const nodeRef = React.useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (localStorage.getItem('token')) {
          console.log('Token found in localStorage, loading user...');
          await dispatch(loadUser()).unwrap();
        } else {
          console.log('No token found in localStorage');
        }
      } catch (error) {
        console.error('Error during authentication initialization:', error);
        localStorage.removeItem('token');
      } finally {
        dispatch(setInitialized());
      }
    };

    initializeAuth();
    queryClient.prefetchQuery('allergens', api.getAllAllergens);
  }, [dispatch, queryClient]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Header />
      <TransitionGroup>
        <CSSTransition
          key={location.pathname}
          classNames="fade"
          timeout={300}
          nodeRef={nodeRef}
        >
          <div ref={nodeRef}>
            <Suspense fallback={<Loading />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/recipes" element={<RecipeList />} />
                <Route path="/recipe/:id" element={<RecipeDetails />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add-recipe" element={<PrivateRoute><RecipeForm /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                <Route path="/my-recipes" element={<PrivateRoute><MyRecipes /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><UserSettings /></PrivateRoute>} />
                <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
                <Route path="/food-scanner" element={<EnhancedFoodScanner />} />
                <Route path="/allergy-info" element={<AllergyInfo />} />
                <Route path="/allergy-info/:allergenId" element={<AllergyInfo />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </ErrorBoundary>
  );
}

/**
 * Root component of the application.
 * Sets up Redux store, React Query, and routing.
 */
function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Router>
            <AppContent />
            <ToastContainer />
          </Router>
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;