import DataTable from '@client/components/table/data-table';
import { salesColumn } from '@client/components/table/sales-column';
import api from '@client/lib/api/api';
import { SalesColumn } from '@client/types/column';
import { buttonVariants } from '@e-commerce-monorepo/ui';
import { headers } from 'next/headers';
import Link from 'next/link';
import React from 'react';

const getSales = async () => {
  const cookies = headers().get('cookie');
  const response = await api.get<{ sales: SalesColumn[] }>('/product/sale', {
    headers: {
      Cookie: cookies,
    },
  });
  return response.data;
};

const SalesPage = async () => {
  const data = await getSales();
  return (
    <div className="rounded-lg border border-border p-10 pb-16 shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Sales</h2>
          <p className="text-muted-foreground">
            Manage your sales and discounts
          </p>
        </div>
        <Link href="/admin/sales/new" className={buttonVariants()}>
          Add New Sale
        </Link>
      </div>
      <div>
        <DataTable
          data={data.sales}
          columns={salesColumn}
          title="No sale has been added yet"
          href="/admin/sales/new"
          buttonText="Add New Sale"
        />
      </div>
    </div>
  );
};

export default SalesPage;
