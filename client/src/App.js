import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from './store/index.js';
import { loadUser, setInitialized } from './store/slices/authSlice';
import Header from './components/Header';
import Loading from './components/Loading';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'));
const RecipeList = lazy(() => import('./pages/RecipeList'));
const AddRecipe = lazy(() => import('./pages/AddRecipe'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const MyRecipes = lazy(() => import('./pages/MyRecipes'));
const RecipeDetails = lazy(() => import('./pages/RecipeDetails'));

function AppContent() {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

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
  }, [dispatch]);

  if (!isInitialized) {
    return <Loading />;
  }

  return (
    <Router>
      <ErrorBoundary>
        <Header />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-recipe" element={<PrivateRoute><AddRecipe /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/my-recipes" element={<PrivateRoute><MyRecipes /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;