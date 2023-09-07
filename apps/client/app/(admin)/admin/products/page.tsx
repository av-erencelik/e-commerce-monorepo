import DataTable from '@client/components/table/data-table';
import { productsColumn } from '@client/components/table/products-column';
import api from '@client/lib/api/api';
import { buttonVariants } from '@e-commerce-monorepo/ui';
import Link from 'next/link';
import React from 'react';

const fetchProducts = async () => {
  const response = await api.get('/product');
  return response.data;
};

const AdminProductsPage = async () => {
  const data = await fetchProducts();

  return (
    <div className="rounded-lg border border-border p-10 pb-16 shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your products and their variants
          </p>
        </div>
        <Link href="/products/new" className={buttonVariants()}>
          Add New Product
        </Link>
      </div>
      <div>
        <DataTable
          data={data.products}
          columns={productsColumn}
          title="No product has been added yet"
          href="/admin/products/new"
          buttonText="Add New Product"
        />
      </div>
    </div>
  );
};

export default AdminProductsPage;
