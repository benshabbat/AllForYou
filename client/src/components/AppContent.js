import { useEffect, Suspense, memo, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useQueryClient } from 'react-query';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useAuth } from '../hooks/useAuth';
import { initializeAuth } from '../utils/authUtils';
import routes from '../constants/routes';
import Header from './layout/header/Header';
import PrivateRoute from './PrivateRoute';
import NotFound from './NotFound';
import { Loading, ErrorBoundary } from './common';

const AppContent = memo(() => {
  const dispatch = useDispatch();
  const { isLoading } = useAuth();
  const location = useLocation();
  const nodeRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    initializeAuth(dispatch, queryClient);
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
                {routes.map(({ path, element, isPrivate }) => (
                  <Route
                    key={path}
                    path={path}
                    element={isPrivate ? <PrivateRoute>{element}</PrivateRoute> : element}
                  />
                ))}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </ErrorBoundary>
  );
});

export default AppContent;