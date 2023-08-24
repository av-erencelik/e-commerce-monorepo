'use client';
import { loginSchema } from '@e-commerce-monorepo/global-types';
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
import { PasswordInput } from '../password-input';
import { useMutation } from '@tanstack/react-query';
import { loginUserFn } from '../../lib/api/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth-state';
import { Loader2 } from 'lucide-react';

const LoginForm = () => {
  const { login } = useAuthStore();
  const router = useRouter();
  const { isError, error, isLoading, mutate } = useMutation(loginUserFn, {
    onSuccess(data) {
      login(data.user);
      router.push('/');
      router.refresh();
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
          Login
        </Button>
        {isError && (
          <p className="text-destructive text-xs text-center">
            {axios.isAxiosError(error)
              ? error.response?.data.message || 'An error occurred'
              : 'An error occurred'}
          </p>
        )}
      </form>
    </Form>
  );
};

export default LoginForm;
