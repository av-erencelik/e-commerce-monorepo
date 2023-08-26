'use client';

import * as React from 'react';

import { cn } from '@e-commerce-monorepo/ui';
import { Button } from '@e-commerce-monorepo/ui/server';
import { Input, type InputProps } from '@e-commerce-monorepo/ui';
import { EyeOpenIcon, EyeNoneIcon } from '@radix-ui/react-icons';

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={props.value === '' || props.disabled}
        >
          {showPassword ? (
            <EyeNoneIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOpenIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };