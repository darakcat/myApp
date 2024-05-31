// src/components/PrivateRoute.tsx
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
