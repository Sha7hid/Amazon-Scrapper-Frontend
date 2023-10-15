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

  return <button  class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={handleGoogleLogin}>Log In</button>;
};

export default LoginButton;

