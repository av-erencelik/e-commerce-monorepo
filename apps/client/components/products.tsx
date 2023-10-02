import { ProductSubCategory } from '@client/types';
import { Product } from '@client/types/column';
import React from 'react';
import ProductFilters from './products-filters';
import ProductCard from './cards/product-card';
import { PaginationButton } from './pagination';
import { Separator } from '@e-commerce-monorepo/ui';

interface ProductsProps extends React.HTMLAttributes<HTMLDivElement> {
  products: Product[];
  pageCount: number;
  subcategories: ProductSubCategory[];
}

const Products = ({
  products,
  pageCount,
  subcategories,
  ...props
}: ProductsProps) => {
  return (
    <section className="flex flex-col space-y-6" {...props}>
      <ProductFilters subcategories={subcategories} />
      {products.length <= 0 ? (
        <div className="mx-auto flex max-w-xs flex-col space-y-1.5">
          <h1 className="text-center text-2xl font-bold">No products found</h1>
          <p className="text-center text-muted-foreground">
            Try changing your filters, or check back later for new products
          </p>
        </div>
      ) : null}
      {<Separator className="my-3" />}
      <div className="grid xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length > 0 ? <PaginationButton pageCount={pageCount} /> : null}
    </section>
  );
};

export default Products;
