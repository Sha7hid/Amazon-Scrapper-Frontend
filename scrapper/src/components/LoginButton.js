// components/LoginButton.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const LoginButton = () => {
  const { loginWithRedirect, user } = useAuth0();

  const handleGoogleLogin = async () => {
      // Log in with Auth0
      loginWithRedirect();

      // After successful login, create or retrieve the user in your MongoDB collection
  };

  return <button onClick={handleGoogleLogin}>Log In with Google</button>;
};

export default LoginButton;

