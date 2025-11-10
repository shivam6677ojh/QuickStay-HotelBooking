import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from '../api/client';

const AuthSetup = () => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn && getToken) {
      // Set the token getter function for API client
      setTokenGetter(getToken);
      console.log('Auth token getter configured');
    }
  }, [getToken, isSignedIn]);

  return null; // This component doesn't render anything
};

export default AuthSetup;
