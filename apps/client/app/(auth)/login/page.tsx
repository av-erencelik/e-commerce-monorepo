import Link from 'next/link';
import LoginForm from '../../../components/forms/login-form';
import React from 'react';

const LoginPage = () => {
  return (
    <div className="p-3 w-full">
      <div className="rounded-xl border bg-card text-card-foreground shadow max-w-md w-full mx-auto">
        <div className="flex flex-col p-6 space-y-1">
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Login
          </h1>
          <p className="text-sm text-muted-foreground">
            Login with your email and password
          </p>
        </div>
        <div className="p-6 pt-0 grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <LoginForm />
          <div className="flex justify-between mt-2">
            <div className="text-sm text-muted-foreground">
              <span className="mr-1 hidden sm:inline-block">
                Don&apos;t have an account?
              </span>
              <Link
                aria-label="Sign up"
                href="/signup"
                className="text-primary underline-offset-4 transition-colors hover:underline"
              >
                Sign up
              </Link>
            </div>
            <Link
              aria-label="Forgot password"
              href="/login/forgot-password"
              className="text-sm text-primary underline-offset-4 transition-colors hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
