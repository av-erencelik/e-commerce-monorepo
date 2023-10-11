import Checkout from '@client/components/checkout/checkout';
import CheckoutItems from '@client/components/checkout/checkout-items';
import { env } from '@client/env.mjs';
import { formatPrice } from '@client/lib/utils';
import { Order } from '@client/types';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

type CheckoutPageProps = {
  params: {
    orderId: string;
  };
};

async function getOrder(orderId: string) {
  const cookies = headers().get('cookie');
  if (!cookies) {
    return null;
  }
  try {
    const response = await fetch(`${env.NX_API_URL}/shop/order/${orderId}`, {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
      },
    });
    const { data } = (await response.json()) as {
      message: string;
      statusCode: number;
      data: { order: Order };
    };
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const CheckoutPage = async ({ params }: CheckoutPageProps) => {
  const { orderId } = params;
  const data = await getOrder(orderId);

  if (
    !data ||
    data.order.status !== 'not confirmed' ||
    data.order.paymentIntentId === null ||
    data.order.clientSecret === null ||
    data.order.orderItem.length === 0
  ) {
    notFound();
  }

  return (
    <section className="relative flex h-full min-h-[100dvh] flex-col items-start justify-center lg:h-[100dvh] lg:flex-row lg:overflow-hidden">
      <div className="w-full space-y-12 pt-8 lg:pt-16">
        <div className="fixed top-0 z-40 h-16 w-full py-4 lg:static lg:top-auto lg:z-0 lg:h-0 lg:py-0">
          <div className="container flex max-w-xl items-center justify-between space-x-2 lg:ml-auto lg:mr-0 lg:pr-[4.5rem]">
            <Link
              aria-label="Back to cart"
              href="/cart"
              className="group flex w-28 items-center space-x-2 lg:flex-auto"
            >
              <ArrowLeftIcon
                className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
              <div className="block font-medium transition group-hover:hidden">
                Sourdough
              </div>
              <div className="hidden font-medium transition group-hover:block text-primary">
                Back
              </div>
            </Link>
          </div>
        </div>
        <div className="container flex max-w-xl flex-col items-center space-y-1 lg:ml-auto lg:mr-0 lg:items-start lg:pr-[4.5rem]">
          <div className="line-clamp-1 font-semibold text-muted-foreground">
            Pay
          </div>
          <div className="text-3xl font-bold">
            {formatPrice(data.order.totalAmount)}
          </div>
        </div>
        <CheckoutItems items={data.order.orderItem} />
      </div>
      <Checkout clientSecret={data.order.clientSecret} />
    </section>
  );
};

export default CheckoutPage;
