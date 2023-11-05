'use client';

import {
  formatPrice,
  getCartTotalPrice,
  getErrorMessage,
} from '@client/lib/utils';
import { useCartStore } from '@client/stores/cart-state';
import Image from 'next/image';
import { MinusIcon, PlusIcon, ShoppingCartIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import {
  cn,
  buttonVariants,
  toast,
  Button,
  Input,
  Separator,
} from '@e-commerce-monorepo/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  removeFromCart,
  updateQuantityOfProductInCart,
} from '@client/lib/api/api-service';
import { useId, useTransition } from 'react';
import api from '@client/lib/api/api';
import { IGenericPostResponse } from '@client/types/api';
import { useRouter } from 'next/navigation';

const ReviewCart = () => {
  const id = useId();
  const { cart } = useCartStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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

  const handleCheckout = async () => {
    startTransition(async () => {
      const totalPrice = getCartTotalPrice(cart);
      try {
        const response = await api.post<
          IGenericPostResponse & {
            data: { clientSecret: string; orderId: string };
          }
        >(`/shop/order?total=${totalPrice}`);
        const { data } = response.data;
        router.push(`/checkout/${data.orderId}`);
      } catch (error) {
        toast({
          title: 'Error',
          description: getErrorMessage(error),
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <>
      <div className="space-y-5">
        {cart && cart.cartItems.length > 0 ? (
          <>
            <section className="flex flex-col gap-8 lg:gap-16 rounded-lg border border-border lg:p-8 p-2 shadow-md">
              {cart?.cartItems?.map((item) => {
                return (
                  <div key={item.id} className="space-y-3">
                    <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
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
                );
              })}
            </section>
            <section className="flex flex-col gap-4 lg:gap-8 rounded-lg border border-border lg:p-4 p-2 shadow-md max-w-[350px]">
              <div className="grid gap-1">
                <h4 className="font-bold tracking-tighter lg:leading-[1.1] text-base md:text-lg">
                  Cart Summary
                </h4>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Checkout your items
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subtotal:
                  </span>
                  <span className="text-sm font-medium">
                    {formatPrice(getCartTotalPrice(cart))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Shipping:
                  </span>
                  <span className="text-sm font-medium">Free</span>
                </div>
                <Button
                  id={`${id}-checkout`}
                  variant="default"
                  size="sm"
                  className="w-full"
                  disabled={isPending}
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </section>
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
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewCart;
