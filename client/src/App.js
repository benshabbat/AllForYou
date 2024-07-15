import React, { useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { store } from './store/index.js';
import { loadUser, setInitialized } from './store/slices/authSlice';
import Header from './components/Header';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import AppRoute from './components/AppRoute';

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
const UserSettings = lazy(() => import('./pages/UserSettings'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

const routes = [
  { path: '/', component: Home },
  { path: '/recipes', component: RecipeList },
  { path: '/recipe/:id', component: RecipeDetails },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/add-recipe', component: AddRecipe, isPrivate: true },
  { path: '/profile', component: UserProfile, isPrivate: true },
  { path: '/my-recipes', component: MyRecipes, isPrivate: true },
  { path: '/settings', component: UserSettings, isPrivate: true },
  { path: '/favorites', component: FavoritesPage, isPrivate: true },
];

function AppContent() {
  const dispatch = useDispatch();
  const { isLoading } = useAuth();
  const location = useLocation();

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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Header />
      <TransitionGroup>
        <CSSTransition key={location.pathname} classNames="fade" timeout={300}>
          <Routes location={location}>
            {routes.map((route) => (
              <AppRoute
                key={route.path}
                path={route.path}
                component={route.component}
                isPrivate={route.isPrivate}
              />
            ))}
            <AppRoute path="*" component={NotFound} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;