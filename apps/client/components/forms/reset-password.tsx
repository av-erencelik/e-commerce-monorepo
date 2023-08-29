'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@e-commerce-monorepo/ui';
import { Button } from '@e-commerce-monorepo/ui/server';
import { useMutation } from '@tanstack/react-query';
import { resetPasswordFn } from '../../lib/api/auth';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { resetPasswordSchema } from '@e-commerce-monorepo/global-types';
import { PasswordInput } from '../password-input';
import { useSearchParams } from 'next/navigation';

const ResetPasswordForm = ({ token }: { token: string }) => {
  const searchParams = useSearchParams();
  const { isError, error, isLoading, mutate, isSuccess } =
    useMutation(resetPasswordFn);
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    const userId = searchParams.get('id');
    if (!userId) {
      throw new Error('User id not found');
    }
    mutate({ data: values, token, userId });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
          Submit
        </Button>
        {isError && (
          <p className="text-destructive text-xs text-center">
            {axios.isAxiosError(error)
              ? error.response?.data.message || 'An error occurred'
              : 'An error occurred'}
          </p>
        )}
        {isSuccess && (
          <p className="text-foreground text-xs text-center">
            Password reset successfully, you can now login with your new
            password.
          </p>
        )}
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
