'use client';

import { UserPayload } from '@e-commerce-monorepo/global-types';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth-state';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@client/lib/api/api-service';

type AuthStoreInitializerProps = {
  user: UserPayload | null;
};

const AuthStoreInitializer = ({ user }: AuthStoreInitializerProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    if (!isLoading && !isError && data) {
      useAuthStore.setState({ user: data.user });
    }
  }, [data, isLoading, isError]);
  return null;
};

export default AuthStoreInitializer;
