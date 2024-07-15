import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Loading from './Loading';

const AppRoute = ({ component: Component, isPrivate, ...rest }) => {
  const RouteComponent = isPrivate ? PrivateRoute : Route;

  return (
    <RouteComponent {...rest}>
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </RouteComponent>
  );
};

export default AppRoute;