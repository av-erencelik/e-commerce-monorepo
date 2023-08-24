'use client';

import { UserPayload } from '@e-commerce-monorepo/global-types';
import { useRef } from 'react';
import { useAuthStore } from '../stores/auth-state';

type AuthStoreInitializerProps = {
  user: UserPayload | null;
};

const AuthStoreInitializer = ({ user }: AuthStoreInitializerProps) => {
  const initialized = useRef(false);

  if (!initialized.current) {
    useAuthStore.setState({ user: user });
    initialized.current = true;
  }
  return null;
};

export default AuthStoreInitializer;
