'use client';
import DataTable from '@client/components/table/data-table';
import { productsColumn } from '@client/components/table/products-column';
import { getAllProducts, getSubcategory } from '@client/lib/api/api-service';
import { capitalizeFirstLetter, getErrorMessage } from '@client/lib/utils';
import { Button, Skeleton, buttonVariants } from '@e-commerce-monorepo/ui';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

const SubcategoryDetailsPage = ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const { categoryId } = params;
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['category_products', categoryId],
    queryFn: () => getAllProducts(1, parseInt(categoryId)),
    retry: false,
    cacheTime: 10000,
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const {
    data: categoryData,
    isError: isCategoryError,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getSubcategory(categoryId),
    retry: false,
    cacheTime: 10000,
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  if (isError || isCategoryError) {
    return (
      <section className="items-center gap-8 pb-8 pt-6 md:py-8 container flex h-[calc(100dvh-124px)] flex-col justify-center max-w-md">
        <div
          className="rounded-xl border bg-card text-card-foreground shadow grid w-full place-items-center"
          role="alert"
          aria-live="assertive"
          aria-atomic
        >
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-muted">
              <ExclamationTriangleIcon className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div className="p-6 pt-0 flex min-h-[176px] flex-col items-center justify-center space-y-2.5 text-center">
            <h3 className="font-semibold tracking-tight text-2xl">
              {getErrorMessage(error || categoryError)}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-4">
              Subcategory with id {categoryId} probably does not exist. Please
              try again later.
            </p>
          </div>
          <div className="flex items-center p-6 pt-0">
            <Button asChild variant="ghost" className="text-primary">
              <Link href="/admin">Go Back</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading || categoryLoading) {
    return (
      <>
        <div className="rounded-lg border border-border p-10 pb-16 shadow-md w-full">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-5 w-52" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="rounded-lg border border-border p-10 pb-16 shadow-md w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">
              {capitalizeFirstLetter(categoryData.subcategory.name)}
            </h2>
            <p className="text-muted-foreground">
              {capitalizeFirstLetter(categoryData.subcategory.description)}
            </p>
          </div>
          <Link href={`${categoryId}/edit`} className={buttonVariants()}>
            Edit Subcategory
          </Link>
        </div>
        <div>
          <DataTable
            data={data.products}
            columns={productsColumn}
            title="No Products Found"
            href="/admin/producs/new"
            buttonText="Add New Product"
          />
        </div>
      </div>
    </>
  );
};

export default SubcategoryDetailsPage;
