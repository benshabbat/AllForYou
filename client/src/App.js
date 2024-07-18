import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { store } from './store/index.js';
import { loadUser, setInitialized } from './store/slices/authSlice';
import Header from './components/Header';
import Loading from './components/Loading';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import { ToastProvider, ToastContainer } from './components/Toast';

const queryClient = new QueryClient();

const Home = lazy(() => import('./pages/Home'));
const RecipeList = lazy(() => import('./pages/RecipeList'));
const RecipeForm = lazy(() => import('./pages/AddRecipe.jsx'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const MyRecipes = lazy(() => import('./pages/MyRecipes'));
const RecipeDetails = lazy(() => import('./pages/RecipeDetails'));
const UserSettings = lazy(() => import('./pages/UserSettings'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

function AppContent() {
  const dispatch = useDispatch();
  const { isLoading } = useAuth();
  const location = useLocation();
  const nodeRef = React.useRef(null);

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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </ErrorBoundary>
  );
}

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