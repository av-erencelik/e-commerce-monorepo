'use client';

import { updateUserFn } from '@client/lib/api/auth-service';
import { getErrorMessage } from '@client/lib/utils';
import { IGetUserResponse } from '@client/types/api';
import { Button, Input, toast } from '@e-commerce-monorepo/ui';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import countryCodes from './country-codes.json';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUserSchema } from '@e-commerce-monorepo/global-types';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { isAxiosError } from 'axios';

const UpdateUserForm = ({ user }: { user: IGetUserResponse['user'] }) => {
  const router = useRouter();
  const { isError, error, isLoading, mutateAsync } = useMutation(updateUserFn, {
    onSuccess(data) {
      router.refresh();
      toast({
        title: 'Account updated successfully',
        description: 'Your account has been updated successfully',
        variant: 'success',
      });
    },
    onError(error, variables, context) {
      toast({
        title: 'Account update failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      countryCode: user.countryCode,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      email: user.email,
    },
  });
  const countries = countryCodes;
  async function onSubmit(values: z.infer<typeof updateUserSchema>) {
    await mutateAsync(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="md:flex gap-2 block">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex-1">
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
              <FormItem className="flex-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <Button type="submit" className="md:w-36" disabled={isLoading}>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
          Update
        </Button>
        {isError && (
          <p className="text-destructive text-xs text-center">
            {isAxiosError(error)
              ? error.response?.data.message || 'An error occurred'
              : 'An error occurred'}
          </p>
        )}
      </form>
    </Form>
  );
};

export default UpdateUserForm;
