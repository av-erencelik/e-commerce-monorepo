'use client';
import { Product } from '@client/types/column';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
  SelectGroup,
} from '@e-commerce-monorepo/ui';
import { EditProductFormSchema } from '@e-commerce-monorepo/global-types';
import { Input } from '@e-commerce-monorepo/ui';
import { Button } from '@e-commerce-monorepo/ui/server';
import { ImagePlus, Loader2 } from 'lucide-react';
import {
  editProduct,
  getCategories,
  getPreSignedUrls,
} from '@client/lib/api/api-service';
import AdminCarousel from '../admin-carousel';
import { getErrorMessage } from '@client/lib/utils';

type EditProductFormProps = {
  product: Product;
};

const EditProductForm = ({ product }: EditProductFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    mutateAsync: editProductMutate,
  } = useMutation(editProduct, {
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
        description: 'Product edited successfully',
      });
    },
  });
  const {
    isError: isPreSignedUrlsError,
    error: PreSignedUrlsError,
    isLoading: isPreSignedUrlsLoading,
    mutateAsync: getPreSignedUrlsMutate,
  } = useMutation(getPreSignedUrls, {
    onError(error, variables, context) {
      console.log(error);
    },
  });
  const form = useForm<z.infer<typeof EditProductFormSchema>>({
    resolver: zodResolver(EditProductFormSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: product.name,
      price: product.price[0].price.toString(),
      description: product.description,
      images: product.images,
      stock: product.stock.toString(),
      subCategoryId: product.categoryId.toString(),
      weight: product.weight?.toString() || '',
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    name: 'images',
    control: form.control,
  });

  async function onSubmit(values: z.infer<typeof EditProductFormSchema>) {
    if (!isSubmitted) return;
    if (!data) return;
    setIsSubmitted(false);
    const { images } = values;
    // get images that type is not undefined
    const imagesToUpload = images.filter((image) => image.type);
    // change image key to name and type
    const imagesKeyToName = imagesToUpload.map((image) => {
      return {
        name: image.key,
        type: image.type || '',
      };
    });
    // get pre signed urls
    const dataImages = await getPreSignedUrlsMutate(imagesKeyToName);
    // upload images
    await Promise.all(
      dataImages.images.map(async (image, index) => {
        const response = await fetch(image.url, {
          method: 'PUT',
          body: imagesToUpload[index].file,
          headers: {
            'Content-Type': imagesToUpload[index].type || '',
          },
        });
        if (response.ok) {
          console.log('success');
        }
      })
    );

    // get uploaded images with isFeatured and key

    const uploadedImages = imagesToUpload.map((image, index) => {
      return {
        key: dataImages.images[index].key,
        isFeatured: image.isFeatured,
        url: image.url,
      };
    });

    const alreadyUploadedImages = images.filter((image) => !image.type);

    // edit values to correct format for api

    await editProductMutate({
      data: {
        ...values,
        subCategoryId: parseInt(values.subCategoryId),
        categoryId:
          data.find((category) =>
            category.subCategories.find(
              (subCategory) => subCategory.id === parseInt(values.subCategoryId)
            )
          )?.id || 0,
        price: parseInt(values.price),
        stock: parseInt(values.stock),
        weight: values.weight ? parseInt(values.weight) : undefined,
        images: [...uploadedImages, ...alreadyUploadedImages],
      },
      productId: product.id,
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
              <FormLabel>Product Name *</FormLabel>
              <FormControl>
                <Input placeholder="Bread" {...field} className="max-w-xl" />
              </FormControl>
              <FormDescription>Name of the product</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Healthy natural bread"
                  {...field}
                  className="max-w-xl"
                />
              </FormControl>
              <FormDescription>Description of the product</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-8 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Product Price *</FormLabel>
                <FormControl>
                  <Input placeholder="10" {...field} />
                </FormControl>
                <FormDescription>Price of the product</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Product Stock *</FormLabel>
                <FormControl>
                  <Input placeholder="10" {...field} />
                </FormControl>
                <FormDescription>Stock of the product</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-8 md:flex-row">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Product Weight</FormLabel>
                <FormControl>
                  <Input placeholder="10" {...field} />
                </FormControl>
                <FormDescription>Weight of the product (gr)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subCategoryId"
            render={({ field: { ref, ...field } }) => (
              <FormItem className="flex-1">
                <FormLabel>Product Category *</FormLabel>
                <Select {...field} onValueChange={field.onChange}>
                  <FormControl ref={ref}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-72">
                    <SelectItem value="" disabled>
                      Select a category
                    </SelectItem>
                    {data[0].subCategories.length === 0 &&
                    data[1].subCategories.length === 0 ? (
                      <SelectGroup>
                        <SelectLabel>No categories found</SelectLabel>
                      </SelectGroup>
                    ) : (
                      data.map((category) => (
                        <SelectGroup key={category.name + category.id}>
                          <SelectLabel>{category.name}</SelectLabel>
                          {category.subCategories.map((subCategory) => (
                            <SelectItem
                              value={subCategory.id.toString()}
                              key={subCategory.id}
                            >
                              {subCategory.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>Category of the product</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="images"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem className="flex-1">
              <FormLabel className="flex gap-2 items-center">
                <span>Product Images</span>
                <div
                  aria-label="Product Placeholder"
                  role="img"
                  aria-roledescription="placeholder"
                  className="flex aspect-square h-10 w-10 items-center justify-center cursor-pointer"
                >
                  <ImagePlus
                    className="h-7 w-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Add image</span>
                </div>
              </FormLabel>
              <AdminCarousel
                images={fields}
                removeImage={remove}
                updateImage={update}
              />
              <FormControl>
                <Input
                  placeholder="10"
                  {...fieldProps}
                  type="file"
                  multiple
                  className="hidden"
                  accept="image/*"
                  onChange={async (event) => {
                    if (event.target.files) {
                      const images = await Promise.all(
                        Array.from(event.target.files).map(async (file) => {
                          return {
                            key: file.name,
                            isFeatured: false,
                            url: URL.createObjectURL(file),
                            type: file.type,
                            file: file,
                          };
                        })
                      );
                      append(images);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          onClick={() => {
            setIsSubmitted(true);
            setTimeout(() => {
              setIsSubmitted(false);
            }, 1000);
          }}
        >
          {(isLoading || isPreSignedUrlsLoading) && (
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-white" />
          )}
          Save Changes
        </Button>
        {isError && (
          <p className="text-destructive text-xs text-center">
            {getErrorMessage(error)}
          </p>
        )}
        {isPreSignedUrlsError && (
          <p className="text-destructive text-xs text-center">
            {getErrorMessage(PreSignedUrlsError)}
          </p>
        )}
      </form>
    </Form>
  );
};

export default EditProductForm;
