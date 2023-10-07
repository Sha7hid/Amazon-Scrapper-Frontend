// src/components/ProtectedRoute.js
import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const ProtectedRoute = ({ component, ...args }) => {
  return (
    <Route
      component={withAuthenticationRequired(component, {
        onRedirecting: () => <div>Loading...</div>,
      })}
      {...args}
    />
  );
};

export default ProtectedRoute;
