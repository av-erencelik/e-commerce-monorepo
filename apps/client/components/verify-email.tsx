'use client';
import { Button } from '@e-commerce-monorepo/ui/server';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { resendVerificationEmailFn, verifyEmailFn } from '../lib/api/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/auth-state';

const VerifyEmail = () => {
  const router = useRouter();
  const { setUserVerified } = useAuthStore();
  const searchParams = useSearchParams();
  const {
    mutate: resend,
    isError: isResendError,
    isLoading: isResendLoading,
  } = useMutation(resendVerificationEmailFn);
  const {
    isLoading: isVerifyLoading,
    isError: isVerifyError,
    mutate: verify,
  } = useMutation(verifyEmailFn, {
    onSuccess() {
      setUserVerified();
      router.push('/');
      router.refresh();
    },
  });
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verify(token);
    }
  }, [searchParams, verify]);
  const resendEmail = () => {
    resend();
  };
  return (
    <div>
      {isVerifyLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="w-10 h-10 animate-spin text-gold-500" />
        </div>
      ) : (
        <Button
          type="submit"
          className="w-full"
          onClick={resendEmail}
          disabled={isResendLoading}
        >
          {isResendLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
          RESEND VERIFICATION EMAIL
        </Button>
      )}
      <p className="text-center text-sm text-destructive">
        {(isVerifyError || isResendError) &&
          'Something happened please try again later'}
      </p>
    </div>
  );
};

export default VerifyEmail;
