'use client';

import { addToCart } from '@client/lib/api/api-service';
import { getErrorMessage } from '@client/lib/utils';
import { Button, cn, toast } from '@e-commerce-monorepo/ui';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface AddToCartButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  productId: number;
}

const AddToCartWithQuantity = ({
  productId,
  className,
  ...props
}: AddToCartButtonProps) => {
  const [quantity, setQuantity] = useState(1);
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
    <div className="flex gap-1 items-center">
      <div className="rounded-lg border bg-white p-1 flex w-[80px] gap-2 items-center flex-shrink-0 flex-grow-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:text-foreground focus:text-foreground"
          onClick={() => quantity > 1 && setQuantity((prev) => prev - 1)}
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        <p className="text-sm w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 flex-grow-0">
          <span>{quantity}</span>
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:text-foreground focus:text-foreground"
          onClick={() => quantity < 10 && setQuantity((prev) => prev + 1)}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <Button
        aria-label="Add to cart"
        size="sm"
        className={cn('h-8 w-full rounded-lg flex-shrink flex-grow', className)}
        {...props}
        onClick={() => addProductToCart({ productId, quantity })}
      >
        Add to cart
      </Button>
    </div>
  );
};

export default AddToCartWithQuantity;
