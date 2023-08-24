import VerifyEmail from '../../../components/verify-email';
import React from 'react';

const VerifyEmailPage = () => {
  return (
    <div className="p-3 w-full">
      <div className="rounded-xl border bg-card text-card-foreground shadow max-w-md w-full mx-auto">
        <div className="flex flex-col p-6 space-y-1">
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
            Verify Email
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            You need to verify your email address before you can continue. We
            have sent you an email with a link to verify your email address.
          </p>
        </div>
        <div className="p-6 pt-0 grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <VerifyEmail />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
