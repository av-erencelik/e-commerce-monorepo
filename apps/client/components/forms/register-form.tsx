'use client';
import React from 'react';
import { useAuthStore } from '../../stores/auth-state';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@e-commerce-monorepo/global-types';
import { useMutation } from '@tanstack/react-query';
import { signupUserFn } from '../../lib/api/auth-service';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@e-commerce-monorepo/ui';
import { Button } from '@e-commerce-monorepo/ui/server';
import { PasswordInput } from '../password-input';
import { Input } from '@e-commerce-monorepo/ui';
import countryCodes from './country-codes.json';
import Image from 'next/image';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const RegisterForm = () => {
  const { login } = useAuthStore();
  const router = useRouter();
  const { isError, error, isLoading, mutate } = useMutation(signupUserFn, {
    onSuccess(data) {
      login(data.user);
      router.push('/verify-email');
      router.refresh();
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      countryCode: 'TR',
      phoneNumber: '',
      fullName: '',
      passwordConfirmation: '',
    },
  });
  const countries = countryCodes;
  function onSubmit(values: z.infer<typeof signupSchema>) {
    mutate(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fullname</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <div className="flex gap-1">
          <FormField
            control={form.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select {...field} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Birim seç" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-72">
                    {Object.entries(countries).map(([key, value]) => (
                      <SelectItem value={key} key={key}>
                        <div className="flex gap-1 items-center">
                          <Image
                            src={value.image}
                            alt={value.name}
                            height={10}
                            width={20}
                          />
                          <span className="text-xs">{key}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="my-auto">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+123456789012" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

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
          Register
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

export default RegisterForm;
