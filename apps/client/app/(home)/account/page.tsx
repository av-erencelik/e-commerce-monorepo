import { env } from '@client/env.mjs';
import { Metadata } from 'next';
import React from 'react';
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@client/components/page-header';
import { Separator, Shell } from '@e-commerce-monorepo/ui';
import AccountInfo from '@client/components/account/account-info';
import UserOrders from '@client/components/account/user-orders';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_NX_CLIENT_URL),
  title: 'Account',
  description: 'Manage your account settings',
};

const AccountPage = () => {
  return (
    <Shell variant="default">
      <PageHeader id="account-header" aria-labelledby="account-header-heading">
        <PageHeaderHeading size="sm">Account</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your account settings and view your order history
        </PageHeaderDescription>
      </PageHeader>
      <Separator />
      <section
        id="user-account-info"
        aria-labelledby="user-account-info-heading"
        className="w-full overflow-hidden space-y-2"
      >
        <AccountInfo />
        <UserOrders />
      </section>
    </Shell>
  );
};

export default AccountPage;
