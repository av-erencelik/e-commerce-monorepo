import ResetPasswordForm from '../../../../../components/forms/reset-password';
import React from 'react';

const ResetPasswordPage = ({ params }: { params: { resetId: string } }) => {
  const { resetId } = params;
  return (
    <div className="p-3 w-full">
      <div className="rounded-xl border bg-card text-card-foreground shadow max-w-md w-full mx-auto">
        <div className="flex flex-col p-6 space-y-1">
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Enter your new password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password and confirm it
          </p>
        </div>
        <div className="p-6 pt-0 grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <ResetPasswordForm token={resetId} />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
