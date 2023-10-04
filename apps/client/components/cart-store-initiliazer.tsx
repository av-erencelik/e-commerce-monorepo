'use client';

import { getCart } from '@client/lib/api/api-service';
import { useCartStore } from '@client/stores/cart-state';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { useEffect } from 'react';

const CartStoreInitiliazer = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    retry(failureCount, error) {
      if (isAxiosError(error)) {
        return false;
      }
      return failureCount < 2;
    },
  });
  useEffect(() => {
    if (!isLoading && !isError && data) {
      useCartStore.setState({ cart: data.cart });
    }
  }, [data, isLoading, isError]);
  return null;
};

export default CartStoreInitiliazer;
