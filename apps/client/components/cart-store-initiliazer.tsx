'use client';

import { getCart } from '@client/lib/api/api-service';
import { useCartStore } from '@client/stores/cart-state';
import { useQuery } from '@tanstack/react-query';

import { useEffect } from 'react';

const CartStoreInitiliazer = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });
  useEffect(() => {
    if (!isLoading && !isError && data) {
      useCartStore.setState({ cart: data.cart });
    }
  }, [data, isLoading, isError]);
  return null;
};

export default CartStoreInitiliazer;
