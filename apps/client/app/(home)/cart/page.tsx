import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@client/components/page-header';
import ReviewCart from '@client/components/review-cart';
import { Shell } from '@e-commerce-monorepo/ui';

import React from 'react';

const CartPage = () => {
  return (
    <Shell>
      <PageHeader
        id="cart-page-header"
        aria-labelledby="cart-page-header-heading"
      >
        <PageHeaderHeading size="sm">Your Cart</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Review your items and checkout
        </PageHeaderDescription>
      </PageHeader>
      <ReviewCart />
    </Shell>
  );
};

export default CartPage;
