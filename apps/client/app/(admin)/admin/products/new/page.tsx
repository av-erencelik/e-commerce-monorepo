import React from 'react';
import { Separator } from '@e-commerce-monorepo/ui';
import CreateProductForm from '@client/components/forms/create-product';

const CreateProduct = () => {
  return (
    <div className="rounded-lg border border-border p-10 pb-16 shadow-md w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Create Product</h2>
          <p className="text-muted-foreground">Create a new product</p>
        </div>
      </div>
      <Separator className="my-6" />
      <div>
        <CreateProductForm />
      </div>
    </div>
  );
};

export default CreateProduct;
