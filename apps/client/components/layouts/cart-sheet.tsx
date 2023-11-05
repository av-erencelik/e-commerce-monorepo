'use client';

import {
  removeFromCart,
  updateQuantityOfProductInCart,
} from '@client/lib/api/api-service';
import {
  formatPrice,
  getCartTotalPrice,
  getErrorMessage,
  getTotalCartItems,
} from '@client/lib/utils';
import { useCartStore } from '@client/stores/cart-state';
import {
  Sheet,
  ScrollArea,
  SheetContent,
  SheetTrigger,
  Button,
  SheetHeader,
  SheetTitle,
  Separator,
  cn,
  Input,
  toast,
  buttonVariants,
  SheetFooter,
} from '@e-commerce-monorepo/ui';
import { MinusIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useId, useState, useTransition } from 'react';

const CartSheet = () => {
  const id = useId();
  const { cart } = useCartStore();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = getTotalCartItems(cart);
  const queryClient = useQueryClient();
  const { mutateAsync: updateProductQuantity } = useMutation(
    updateQuantityOfProductInCart,
    {
      onError: (error) => {
        toast({
          title: 'Error',
          description: getErrorMessage(error),
          variant: 'destructive',
        });
      },
      onSuccess: () => {
        toast({
          title: 'Updated cart',
          description: 'Cart updated successfully',
          variant: 'success',
        });
      },
    }
  );
  const { mutateAsync: deleteProductFromCart } = useMutation(removeFromCart, {
    onError: (error) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Deleted from cart',
        description: 'Product deleted from cart successfully',
        variant: 'success',
      });
    },
  });
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCartIcon className="h-5 w-5" strokeWidth={1.2} />
          {cart && (
            <span className="absolute -top-1 -right-1 text-xs font-semibold text-white bg-primary bg-primary-500 rounded-full h-4 w-4 flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Toggle Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col pr-0 sm:max-w-lg"
      >
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart {itemCount > 0 && `(${itemCount})`}</SheetTitle>
          <Separator />
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <ScrollArea className="h-full">
              <div className={cn('flex w-full flex-col gap-5 pr-6 flex-1')}>
                {cart?.cartItems.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div
                      className={cn(
                        'flex items-start justify-between gap-4',
                        'flex-col sm:flex-row'
                      )}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            fill
                            className="absolute object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex flex-col space-y-1 self-start">
                          <span className="line-clamp-1 text-sm font-medium">
                            {item.product.name}
                          </span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            {formatPrice(item.product.price[0].price)} x{' '}
                            {item.quantity} ={' '}
                            {formatPrice(
                              (
                                Number(item.product.price[0].price) *
                                Number(item.quantity)
                              ).toFixed(2)
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-between space-x-2 sm:w-auto sm:justify-normal">
                        <div className="flex items-center">
                          <Button
                            id={`${id}-decrement`}
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none hover:text-foreground"
                            onClick={() => {
                              startTransition(async () => {
                                if (item.quantity === 1) {
                                  await deleteProductFromCart(item.product.id);
                                  await queryClient.refetchQueries(['cart']);
                                  return;
                                }
                                await updateProductQuantity({
                                  productId: item.product.id,
                                  quantity: item.quantity - 1,
                                });
                                await queryClient.refetchQueries(['cart']);
                              });
                            }}
                            disabled={isPending}
                          >
                            <MinusIcon className="h-3 w-3" aria-hidden="true" />
                            <span className="sr-only">Remove one item</span>
                          </Button>
                          <Input
                            id={`${id}-quantity`}
                            type="number"
                            min="0"
                            className="h-8 w-14 rounded-none border-x-0"
                            value={item.quantity}
                            onChange={(e) => {
                              if (isPending) return;
                              if (Number(e.target.value) > 10) {
                                toast({
                                  title: 'Error',
                                  description:
                                    'You can only add up to 10 items',
                                  variant: 'destructive',
                                });
                                return;
                              }
                              startTransition(async () => {
                                if (Number(e.target.value) === 0) {
                                  await deleteProductFromCart(item.product.id);
                                  await queryClient.refetchQueries(['cart']);
                                  return;
                                }
                                await updateProductQuantity({
                                  productId: item.product.id,
                                  quantity: Number(e.target.value),
                                });
                                await queryClient.refetchQueries(['cart']);
                              });
                            }}
                            disabled={isPending}
                          />
                          <Button
                            id={`${id}-increment`}
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none hover:text-foreground"
                            onClick={() => {
                              startTransition(async () => {
                                if (item.quantity === 10) {
                                  toast({
                                    title: 'Error',
                                    description:
                                      'You can only add up to 10 items',
                                    variant: 'destructive',
                                  });
                                  return;
                                }
                                await updateProductQuantity({
                                  productId: item.product.id,
                                  quantity: item.quantity + 1,
                                });
                                await queryClient.refetchQueries(['cart']);
                              });
                            }}
                            disabled={isPending}
                          >
                            <PlusIcon className="h-3 w-3" aria-hidden="true" />
                            <span className="sr-only">Add one item</span>
                          </Button>
                        </div>
                        <Button
                          id={`${id}-delete`}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:text-foreground hover:bg-destructive/5"
                          onClick={() => {
                            startTransition(async () => {
                              await deleteProductFromCart(item.product.id);
                              await queryClient.refetchQueries(['cart']);
                            });
                          }}
                          disabled={isPending}
                        >
                          <TrashIcon className="h-3 w-3" aria-hidden="true" />
                          <span className="sr-only">Delete item</span>
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(getCartTotalPrice(cart).toFixed(2))}</span>
                </div>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    aria-label="View your cart"
                    href="/cart"
                    className={buttonVariants({
                      size: 'sm',
                      className: 'w-full',
                    })}
                  >
                    Continue to checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <ShoppingCartIcon
              className="mb-4 h-16 w-16 text-primary"
              aria-hidden="true"
            />
            <div className="text-xl font-medium text-muted-foreground">
              Your cart is empty
            </div>
            <div className="text-sm text-muted-foreground">
              Add items to your cart to checkout
            </div>
            <div className="flex items-center justify-center">
              <SheetTrigger asChild>
                <Link
                  aria-label="Add items to your cart to checkout"
                  href="/breads"
                  className={cn(
                    buttonVariants({
                      variant: 'link',
                      size: 'sm',
                      className: 'text-sm',
                    })
                  )}
                >
                  Breads
                </Link>
              </SheetTrigger>
              <SheetTrigger asChild>
                <Link
                  aria-label="Add items to your cart to checkout"
                  href="/chocolates"
                  className={cn(
                    buttonVariants({
                      variant: 'link',
                      size: 'sm',
                      className: 'text-sm',
                    })
                  )}
                >
                  Chocolates
                </Link>
              </SheetTrigger>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
