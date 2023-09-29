import ProductCard from '@client/components/cards/product-card';
import { siteConfig } from '@client/config/site';
import api from '@client/lib/api/api';
import { Product } from '@client/types/column';
import { Badge, Shell, buttonVariants, cn } from '@e-commerce-monorepo/ui';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';

const getNewestProducts = async () => {
  const response = await api.get('/product/featured?newest=true');
  return response.data;
};

const getBestSellingProducts = async () => {
  const response = await api.get('/product/featured?most_sold=true');
  return response.data;
};

export default async function Index() {
  const { products: bestSellingProducts } = await getBestSellingProducts();
  const { products: newProducts } = await getNewestProducts();

  return (
    <Shell className="gap-12">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:py-28"
      >
        <Link href={siteConfig.github} target="_blank" rel="noreferrer">
          <Badge
            aria-hidden="true"
            className="rounded-md px-3.5 py-1.5"
            variant="secondary"
          >
            View on
            <GitHubLogoIcon className="ml-2 h-3.5 w-3.5" />
          </Badge>
          <span className="sr-only">GitHub</span>
        </Link>
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
          An example e-commerce application built with Express microservices and
          Next.js
        </h1>
        <Balancer className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
          Welcome to our Homemade Delights! Discover the art of handcrafted
          breads and chocolates, made with love.
        </Balancer>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/products" className={cn(buttonVariants({ size: 'lg' }))}>
            Buy now
            <span className="sr-only">Buy now</span>
          </Link>
        </div>
      </section>
      <section
        id="best-seller-products"
        aria-labelledby="best-seller-products-heading"
        className="space-y-10"
      >
        <div className="flex items-center gap-5">
          <h2 className="flex-1 text-2xl font-heading font-bold sm:text-3xl whitespace-nowrap flex-nowrap max-w-fit text-primary">
            Try Our Best Selling
          </h2>
          <span className="py-10 border-r border-secondary-foreground md:block hidden"></span>
          <p className="flex-1 max-w-xl font-medium text-sm text-muted-foreground/90 md:block hidden">
            Explore our handpicked selection of customer favorites. These are
            the cherished creations that have won the hearts and taste buds of
            our community. Indulge in the very best our bakery has to offer.
          </p>
        </div>
        <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-3">
          {bestSellingProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section
        id="newest-product"
        aria-labelledby="newest-products-heading"
        className="space-y-10"
      >
        <div className="flex items-center gap-5">
          <h2 className="flex-1 text-2xl font-heading font-bold sm:text-3xl whitespace-nowrap flex-nowrap max-w-fit text-primary">
            Our Latest Products
          </h2>
          <span className="py-10 border-r border-secondary-foreground md:block hidden"></span>
          <p className="flex-1 max-w-xl font-medium text-sm text-muted-foreground/90 md:block hidden">
            Be the first to savor our freshest arrivals! From mouthwatering
            breads to irresistible chocolates, these are the newest additions to
            our artisanal collection. Stay ahead of the curve and experience the
            latest trends in homemade delights.
          </p>
        </div>
        <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-3">
          {newProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </Shell>
  );
}
