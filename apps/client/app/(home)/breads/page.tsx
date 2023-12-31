import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@client/components/page-header';
import Products from '@client/components/products';
import { env } from '@client/env.mjs';
import { getCategories } from '@client/lib/api/api-service';
import { getBreadsProducts } from '@client/lib/api/product';
import { Shell } from '@e-commerce-monorepo/ui';
import { type Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_NX_CLIENT_URL),
  title: 'Sourdough Breads',
  description: 'Buy from our selection of sourdough breads',
};

interface ProductsPageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

const BreadsProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const { page, subcategory, sort_by, order } = searchParams ?? {};
  const { products, totalCount } = await getBreadsProducts({
    page,
    subcategory,
    sort_by,
    order,
  });
  const totalPages = Math.ceil(totalCount / 12);
  const categories = await getCategories();
  const breadCategory = categories.find((category) => category.id === 1);
  const subcategories = breadCategory?.subCategories ?? [];

  return (
    <Shell>
      <PageHeader
        id="products-page-header"
        aria-labelledby="products-page-header-heading"
      >
        <PageHeaderHeading size="sm">Sourdough Breads</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Buy from our selection of sourdough breads
        </PageHeaderDescription>
      </PageHeader>
      <Products
        products={products}
        pageCount={totalPages}
        subcategories={subcategories}
      />
    </Shell>
  );
};

export default BreadsProductsPage;
