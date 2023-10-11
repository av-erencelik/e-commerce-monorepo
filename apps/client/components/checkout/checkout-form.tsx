'use client';
import React, { useEffect, useId, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { env } from '@client/env.mjs';
import { Button, toast } from '@e-commerce-monorepo/ui';
import { Loader2 } from 'lucide-react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const id = useId();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        setMessage('Something went wrong.');
        return;
      }
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${env.NEXT_PUBLIC_NX_CLIENT_URL}/shop/checkout/success`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || 'An unexpected error occurred.');
    } else {
      setMessage('An unexpected error occurred.');
    }

    toast({
      title: 'Payment failed',
      description: message,
      duration: 5000,
      variant: 'destructive',
    });

    setIsLoading(false);
  };

  return (
    <form
      id={`${id}-payment-form`}
      onSubmit={handleSubmit}
      aria-labelledby={`${id}-checkout-form-heading`}
      className="grid gap-4 container max-w-xl pr-6 lg:ml-0 lg:mr-auto"
    >
      <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
      <Button
        disabled={isLoading || !stripe || !elements}
        id={`${id}-checkout-form-submit`}
        aria-label="Pay"
        variant="secondary"
      >
        <span id="button-text">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            'Pay'
          )}
        </span>
      </Button>
      {message && (
        <div
          id="payment-message"
          className="text-destructive text-center text-sm"
        >
          {message}
        </div>
      )}
    </form>
  );
}
