'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { env } from '@client/env.mjs';
import CheckoutForm from './checkout-form';
import { Separator } from '@e-commerce-monorepo/ui';

type CheckoutProps = {
  clientSecret: string;
  orderId: string;
};

const stripePromise = loadStripe(env.NEXT_PUBLIC_NX_STRIPE_PUBLIC_KEY);

const Checkout = ({ clientSecret, orderId }: CheckoutProps) => {
  return (
    <section className="h-full w-full flex-1 bg-white pb-12 pt-10 lg:flex-initial lg:pl-12 lg:pt-16">
      <div className="w-full p-7 container max-w-xl lg:ml-0 lg:mr-auto">
        <h4 className="font-semibold text-lg tracking-tighter lg:leading-[1.1] leading-tight ">
          Checkout
        </h4>
        <p className="text-muted-foreground">
          This is a demo checkout page. You can use the following test card
        </p>
        <Separator className="my-2 max-w-[525px]" />
        <div className="text-sm flex flex-col gap-1">
          <p>
            <span className="font-medium">Card Number:</span>{' '}
            <span className="text-muted-foreground">4242 4242 4242 4242</span>
          </p>
          <p>
            <span className="font-medium">Exp:</span>{' '}
            <span className="text-muted-foreground">any future date</span>{' '}
          </p>
          <p>
            <span className="font-medium">CVC:</span>{' '}
            <span className="text-muted-foreground">any 3 digits</span>
          </p>
        </div>
      </div>
      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
            },
          }}
        >
          <CheckoutForm orderId={orderId} />
        </Elements>
      )}
    </section>
  );
};

export default Checkout;
