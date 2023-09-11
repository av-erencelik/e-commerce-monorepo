'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@e-commerce-monorepo/ui';
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
import { forgotPasswordFn } from '../../lib/api/auth-service';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { forgotPasswordSchema } from '@e-commerce-monorepo/global-types';

const ForgotPasswordForm = () => {
  const { isError, error, isLoading, mutate, isSuccess } =
    useMutation(forgotPasswordFn);
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
          Reset Password
        </Button>
        {isError && (
          <p className="text-destructive text-xs text-center">
            {axios.isAxiosError(error)
              ? error.response?.data.message || 'An error occurred'
              : 'An error occurred'}
          </p>
        )}
        {isSuccess && (
          <p className="text-success text-xs text-center">
            Check your email for a link to reset your password. If it doesn’t
            appear within a few minutes, check your spam folder.
          </p>
        )}
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
