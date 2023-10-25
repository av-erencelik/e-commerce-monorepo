import { Shell, buttonVariants } from '@e-commerce-monorepo/ui';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'Page Not Found',
};

const NotFoundPage = () => {
  return (
    <Shell className="text-center mx-auto my-auto h-[500px]">
      <section className="space-y-4">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="text-xl tracking-tight">
          We can&apos;t find the page you&apos;re looking for.
        </p>
        <Link href="/" className={buttonVariants()}>
          Continue Shopping
        </Link>
      </section>
    </Shell>
  );
};

export default NotFoundPage;
