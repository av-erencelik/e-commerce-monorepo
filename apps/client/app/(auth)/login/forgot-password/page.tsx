import React from 'react';
import ForgotPasswordForm from '../../../../components/forms/forgot-password';

const ForgotPasswordPage = () => {
  return (
    <div className="p-3 w-full">
      <div className="rounded-xl border bg-card text-card-foreground shadow max-w-md w-full mx-auto">
        <div className="flex flex-col p-6 space-y-1">
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Please provide the email address that you used when you signed up
            for your account
          </p>
        </div>
        <div className="p-6 pt-0 grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
