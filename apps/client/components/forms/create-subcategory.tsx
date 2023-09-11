'use client';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
  Input,
} from '@e-commerce-monorepo/ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@e-commerce-monorepo/ui/server';
import { Loader2 } from 'lucide-react';
import { createSubcategory, getCategories } from '@client/lib/api/api-service';
import { createCategoryFormSchema } from '@e-commerce-monorepo/global-types';
import { getErrorMessage } from '@client/lib/utils';

const CreateSubcategoryForm = () => {
  const { toast } = useToast();
  const {
    data,
    isError: isErrorCategory,
    isLoading: isLoadingCategory,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    retry: false,
    cacheTime: 10000,
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const {
    isError,
    error,
    isLoading,
    mutateAsync: createSubcategoryMutate,
  } = useMutation(createSubcategory, {
    onError() {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred',
      });
    },
    onSuccess() {
      toast({
        variant: 'success',
        title: 'Successful',
        description: 'Subcategory created successfully',
      });
    },
  });
  const form = useForm<z.infer<typeof createCategoryFormSchema>>({
    resolver: zodResolver(createCategoryFormSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
    },
  });
  async function onSubmit(values: z.infer<typeof createCategoryFormSchema>) {
    await createSubcategoryMutate({
      name: values.name,
      description: values.description,
      categoryId: parseInt(values.categoryId),
    });
  }
  if (isLoadingCategory || isErrorCategory)
    return <Loader2 className="w-10 h-10 animate-spin mx-auto text-gold-500" />;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Einkorn Breads"
                  {...field}
                  className="max-w-xl"
                />
              </FormControl>
              <FormDescription>Name of the subcategory</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Healthy natural einkorn breads"
                  {...field}
                  className="max-w-xl"
                />
              </FormControl>
              <FormDescription>Description of the subcategory</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field: { ref, ...field } }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Category *</FormLabel>
              <Select {...field} onValueChange={field.onChange}>
                <FormControl ref={ref}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="" disabled>
                    Select a category
                  </SelectItem>
                  {data.map((category) => (
                    <SelectItem
                      value={category.id.toString()}
                      key={category.id}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Category of the subcategory</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="sm:w-44 w-full" disabled={isLoading}>
          {isLoading && (
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-white" />
          )}
          Save Changes
        </Button>
        {isError && (
          <p className="text-destructive text-xs text-center">
            {getErrorMessage(error)}
          </p>
        )}
      </form>
    </Form>
  );
};

export default CreateSubcategoryForm;
