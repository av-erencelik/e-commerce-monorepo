'use client';
import { DateTimePicker } from '@client/components/date/date-time-picker';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  useToast,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@e-commerce-monorepo/ui';
import {
  getLocalTimeZone,
  parseAbsolute,
  today,
} from '@internationalized/date';
import { addSaleFormSchema } from '@e-commerce-monorepo/global-types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createSale, getAllProductsIds } from '@client/lib/api/api-service';
import { Loader2 } from 'lucide-react';
import { getErrorMessage } from '@client/lib/utils';

const CreateSaleForm = () => {
  const { toast } = useToast();
  const {
    data,
    isError: isErrorProductsIds,
    isLoading: isLoadingProductsIds,
  } = useQuery({
    queryKey: ['productsIds'],
    queryFn: getAllProductsIds,
    retry: false,
    cacheTime: 10000,
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutateAsync } = useMutation(createSale, {
    onError: (error) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Sale created',
        description: 'Sale created successfully',
        variant: 'success',
      });
    },
  });
  const form = useForm<z.infer<typeof addSaleFormSchema>>({
    resolver: zodResolver(addSaleFormSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      discountPrice: '',
      originalPrice: '',
      productId: '',
    },
  });

  function onSubmit(values: z.infer<typeof addSaleFormSchema>) {
    mutateAsync({
      productId: Number(values.productId),
      data: {
        startDate: values.startDate,
        endDate: values.endDate,
        discountPrice: Number(values.discountPrice),
        originalPrice: Number(values.originalPrice),
      },
    });
  }
  if (isLoadingProductsIds || isErrorProductsIds)
    return <Loader2 className="w-10 h-10 animate-spin mx-auto text-gold-500" />;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <FormField
            control={form.control}
            name="discountPrice"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Discount Price *</FormLabel>
                <FormControl>
                  <Input placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Original Price *</FormLabel>
                <FormControl>
                  <Input placeholder="10" {...field} />
                </FormControl>
                <FormDescription>Original price of the product</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-8 md:flex-row">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="flex-1">
                <FormLabel>Start Date</FormLabel>
                <FormControl aria-label="date">
                  <DateTimePicker
                    granularity="minute"
                    value={
                      value
                        ? parseAbsolute(value.toISOString(), getLocalTimeZone())
                        : null
                    }
                    onChange={(date) => {
                      onChange(date ? date.toDate('GMT') : new Date());
                    }}
                    minValue={today(getLocalTimeZone())}
                    maxValue={parseAbsolute(
                      form.getValues('endDate')
                        ? form.getValues('endDate').toISOString()
                        : new Date(
                            new Date().setFullYear(new Date().getFullYear() + 1)
                          ).toISOString(),
                      getLocalTimeZone()
                    )}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Start date of sale</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="flex-1">
                <FormLabel>End Date</FormLabel>
                <FormControl aria-label="date">
                  <DateTimePicker
                    granularity="minute"
                    value={
                      value
                        ? parseAbsolute(value.toISOString(), getLocalTimeZone())
                        : null
                    }
                    onChange={(date) => {
                      onChange(date ? date.toDate('GMT') : new Date());
                    }}
                    minValue={parseAbsolute(
                      form.getValues('startDate')
                        ? form.getValues('startDate').toISOString()
                        : new Date().toISOString(),
                      getLocalTimeZone()
                    )}
                    {...field}
                  />
                </FormControl>
                <FormDescription>End date of sale</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="productId"
          render={({ field: { ref, ...field } }) => (
            <FormItem className="md:w-[50%]">
              <FormLabel>Product *</FormLabel>
              <Select {...field} onValueChange={field.onChange}>
                <FormControl ref={ref}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-72">
                  <SelectItem value="" disabled>
                    Select a product
                  </SelectItem>
                  {data?.products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateSaleForm;
