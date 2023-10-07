// src/auth/Auth0Provider.js
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = 'dev-iam6unjj2w7ufs0s.us.auth0.com';
  const clientId = 'YrAlFxN3kUJJalpUvjgQBpB3U6kXelos';

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
