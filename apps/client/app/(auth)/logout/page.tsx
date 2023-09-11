'use client';
import { useMutation } from '@tanstack/react-query';
import { logoutUserFn } from '../../../lib/api/auth-service';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@client/stores/auth-state';
const LogoutPage = () => {
  const { logout } = useAuthStore();
  const router = useRouter();
  const { mutate, isLoading, isError } = useMutation(logoutUserFn, {
    onSuccess: () => {
      logout();
      router.push('/');
      router.refresh();
    },
    onError: () => {
      router.push('/');
    },
  });
  useEffect(() => {
    mutate();
  }, [mutate]);
  return (
    <div>
      {isLoading && (
        <div className="flex justify-center items-center">
          <Loader2 className="w-10 h-10 animate-spin text-gold-500" />
        </div>
      )}
      {isError && (
        <p className="text-sm text-center text-destructive">
          Something went wrong...
        </p>
      )}
    </div>
  );
};

export default LogoutPage;
