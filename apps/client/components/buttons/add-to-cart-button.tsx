'use client';
import { Button, cn } from '@e-commerce-monorepo/ui';
import React from 'react';

interface AddToCartButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  productId: number;
}

const AddToCartButton = ({
  productId,
  className,
  ...props
}: AddToCartButtonProps) => {
  return (
    <Button
      aria-label="Add to cart"
      size="sm"
      className={cn('h-8 w-full rounded-lg', className)}
      {...props}
    >
      Add to cart
    </Button>
  );
};

export default AddToCartButton;
