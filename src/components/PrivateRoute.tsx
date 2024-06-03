// src/components/PrivateRoute.tsx
import React, { useEffect } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../types/JwtPayload';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            window.location.href = '/login'; // 리디렉션을 위해 window.location.href 사용
          }
        } catch (error) {
          console.error('Token decoding failed:', error);
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    }
  }, [isAuthenticated]);

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
