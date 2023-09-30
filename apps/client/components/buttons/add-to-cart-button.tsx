'use client';
import { addToCart } from '@client/lib/api/api-service';
import { getErrorMessage } from '@client/lib/utils';
import { Button, cn, toast } from '@e-commerce-monorepo/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface AddToCartButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  productId: number;
}

const AddToCartButton = ({
  productId,
  className,
  ...props
}: AddToCartButtonProps) => {
  const queryClient = useQueryClient();
  const { mutate: addProductToCart } = useMutation(addToCart, {
    onError: (error) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      // invalidate react query cache
      queryClient.refetchQueries(['cart']);
      toast({
        title: 'Added to cart',
        description: 'Product added to cart successfully',
        variant: 'success',
      });
    },
  });
  return (
    <Button
      aria-label="Add to cart"
      size="sm"
      className={cn('h-8 w-full rounded-lg', className)}
      {...props}
      onClick={() => addProductToCart({ productId, quantity: 1 })}
    >
      Add to cart
    </Button>
  );
};

export default AddToCartButton;
