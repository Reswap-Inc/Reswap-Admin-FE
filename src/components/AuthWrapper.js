import React from 'react';
import { useSelector } from 'react-redux';
import Layout from './Layout';
import JoyrideWrapper from './JoyrideWrapper';

const AuthWrapper = () => {
  const profile = useSelector((state) => state.getProfileSlice?.data);
  const profileError = useSelector((state) => state.getProfileSlice?.error);
  const isLoading = useSelector((state) => state.getProfileSlice?.loading);

  // Don't render Layout if:
  // 1. Still loading
  // 2. No profile data
  // 3. Profile error (session expired)
  // 4. User type is 'user' (unauthorized)
  if (isLoading || !profile || profileError || (profile && profile?.userType === 'user')) {
    return null;
  }

  return (
    <>
      <Layout />
      <JoyrideWrapper />
    </>
  );
};

export default AuthWrapper; 