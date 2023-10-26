'use client';
import { useMutation } from '@tanstack/react-query';
import { logoutUserFn } from '../../../lib/api/auth-service';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@client/stores/auth-state';
import { useCartStore } from '@client/stores/cart-state';
import { getErrorMessage } from '@client/lib/utils';
const LogoutPage = () => {
  const { logout } = useAuthStore();
  const { setCart } = useCartStore();
  const router = useRouter();
  const { mutate, isLoading, error, isError } = useMutation(logoutUserFn, {
    onSuccess: () => {
      logout();
      setCart(null);
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
          {getErrorMessage(error)}
        </p>
      )}
    </div>
  );
};

export default LogoutPage;
