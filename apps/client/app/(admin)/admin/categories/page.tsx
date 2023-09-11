import DataTable from '@client/components/table/data-table';
import { categoriesColumn } from '@client/components/table/subcategories-column';
import api from '@client/lib/api/api';
import { ProductSubcategoryColumn } from '@client/types/column';
import { buttonVariants } from '@e-commerce-monorepo/ui';
import Link from 'next/link';
import React from 'react';

const fetchSubcategories = async () => {
  const response = await api.get<{ subCategories: ProductSubcategoryColumn[] }>(
    '/product/category'
  );
  return response.data;
};

const CategoriesPage = async () => {
  const data = await fetchSubcategories();
  return (
    <div className="rounded-lg border border-border p-10 pb-16 shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Subcategories</h2>
          <p className="text-muted-foreground">
            Manage your subcategories and their variants
          </p>
        </div>
        <Link href="categories/new" className={buttonVariants()}>
          Add New Subcategory
        </Link>
      </div>
      <div>
        <DataTable
          data={data.subCategories}
          columns={categoriesColumn}
          title="No subcategories found"
          href="/admin/categories/new"
          buttonText="Add New Subcategory"
        />
      </div>
    </div>
  );
};

export default CategoriesPage;
