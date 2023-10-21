import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@client/components/page-header';
import { env } from '@client/env.mjs';
import { checkPayment } from '@client/lib/api/api-service';
import { buttonVariants, cn } from '@e-commerce-monorepo/ui';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_NX_CLIENT_URL),
  title: 'Order Success',
  description: 'Order summary for your purchase',
};

interface OrderSuccessPageProps {
  params: {
    orderId: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

async function checkPaymentStatus(paymentIntent: string) {
  const result = await checkPayment(paymentIntent);
  return result;
}

const PaymentSuccessPage = async ({
  params,
  searchParams,
}: OrderSuccessPageProps) => {
  const { payment_intent } = searchParams ?? {};
  const status = await checkPaymentStatus(payment_intent as string);
  if (!status) {
    notFound();
  }
  if (status.data.payment_status !== 'succeeded') {
    return (
      <div className="flex h-full max-h-[100dvh] w-full flex-col gap-10 overflow-hidden pb-8 pt-6 md:py-8">
        <div className="grid gap-10 overflow-auto mx-auto">
          <PageHeader
            id="order-error-page-header"
            aria-labelledby="order-error-page-header-heading"
            className="container flex max-w-7xl flex-col ustify-center items-center"
          >
            <PageHeaderHeading>Payment Failed</PageHeaderHeading>
            <PageHeaderDescription>Please try again</PageHeaderDescription>
          </PageHeader>
          <section
            id="order-success-actions"
            aria-labelledby="order-success-actions-heading"
            className="container flex max-w-7xl items-center justify-center space-x-2.5"
          >
            <Link
              aria-label="Continue shopping"
              href="/"
              className={cn(
                buttonVariants({
                  size: 'sm',
                  className: 'text-center',
                })
              )}
            >
              Continue shopping
            </Link>
            <Link
              aria-label="Back to cart"
              href="/account"
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                  className: 'text-center',
                })
              )}
            >
              Back to orders
            </Link>
          </section>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full max-h-[100dvh] w-full flex-col gap-10 overflow-hidden pb-8 pt-6 md:py-8">
      <div className="grid gap-10 overflow-auto mx-auto">
        <PageHeader
          id="order-success-page-header"
          aria-labelledby="order-success-page-header-heading"
          className="container flex max-w-7xl flex-col justify-center items-center"
        >
          <PageHeaderHeading>Thank you for your order</PageHeaderHeading>
          <PageHeaderDescription>
            We will be in touch with you shortly
          </PageHeaderDescription>
        </PageHeader>
        <section
          id="order-success-actions"
          aria-labelledby="order-success-actions-heading"
          className="container flex max-w-7xl items-center justify-center space-x-2.5"
        >
          <Link
            aria-label="Continue shopping"
            href="/"
            className={cn(
              buttonVariants({
                size: 'sm',
                className: 'text-center',
              })
            )}
          >
            Continue shopping
          </Link>
          <Link
            aria-label="Back to cart"
            href="/cart"
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'sm',
                className: 'text-center',
              })
            )}
          >
            Back to cart
          </Link>
        </section>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
