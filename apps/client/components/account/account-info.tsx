'use client';

import { getUserDetails } from '@client/lib/api/auth-service';
import { useQuery } from '@tanstack/react-query';
import UpdateUserForm from '../forms/update-user-form';
import { Loader2 } from 'lucide-react';
import { Separator } from '@e-commerce-monorepo/ui';

const AccountInfo = () => {
  const { data, isLoading, isError } = useQuery(
    ['account-info'],
    getUserDetails
  );

  if (isLoading) {
    return (
      <div className="h-60 w-full flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Account Info</h3>
      <UpdateUserForm user={data.user} />
      <Separator className="my-8" />
    </div>
  );
};

export default AccountInfo;
