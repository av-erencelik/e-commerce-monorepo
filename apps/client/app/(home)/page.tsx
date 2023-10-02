import ProductCard from '@client/components/cards/product-card';
import { siteConfig } from '@client/config/site';
import api from '@client/lib/api/api';
import { Product } from '@client/types/column';
import {
  AspectRatio,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Shell,
  buttonVariants,
  cn,
} from '@e-commerce-monorepo/ui';
import { CheckIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
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
        className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 pb-8 pt-6 text-center md:pb-12 md:pt-10 xl:py-28"
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
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl xl:text-6xl xl:leading-[1.1]">
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
        <div className="grid xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-3">
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
        <div className="grid xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-3">
          {newProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section
        id="categories"
        aria-labelledby="categories-heading"
        className="flex gap-5 md:flex-row flex-col"
      >
        <Card className="flex flex-1 xl:w-full overflow-hidden rounded-xl transition-all md:hover:scale-[1.01] md:hover:shadow-lg duration-200 xl:flex-row flex-col">
          <CardHeader className="p-0 border-r xl:w-[35%] space-y-0">
            <Link className="w-full" href="/chocolates">
              <div className="xl:block hidden">
                <AspectRatio ratio={3 / 5}>
                  <Image
                    src="/products/dark-chocolate.webp"
                    alt="Einkorn"
                    className="object-cover"
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, (min-width: 640px) 45vw, (min-width: 475px) 100vw, 100vw"
                    fill
                    loading="lazy"
                  />
                </AspectRatio>
              </div>
              <div className="xl:hidden block">
                <AspectRatio ratio={2 / 1} className="xl:hidden block">
                  <Image
                    src="/products/dark-chocolate.webp"
                    alt="Einkorn"
                    className="object-cover"
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                    fill
                    loading="lazy"
                  />
                </AspectRatio>
              </div>
            </Link>
          </CardHeader>
          <CardContent className="p-4 xl:w-[65%]">
            <Link className="w-full" href="/chocolates">
              <CardTitle className="text-xl font-bold leading-tight tracking-tighter">
                Homemade Chocolates
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground/90 my-2 flex flex-col gap-2">
                <span>
                  <CheckIcon className="inline-block h-4 w-4 mr-1 text-primary" />
                  Pure delight awaits with our homemade chocolates, crafted with
                  passion.
                </span>
                <span>
                  <CheckIcon className="inline-block h-4 w-4 mr-1 text-primary" />
                  Our chocolatiers transform the finest ingredients into
                  luscious, handcrafted confections.
                </span>
                <span>
                  <CheckIcon className="inline-block h-4 w-4 mr-1 text-primary" />
                  From velvety truffles to artisanal bars, each piece is a work
                  of art.
                </span>
                <span>
                  <CheckIcon className="inline-block h-4 w-4 mr-1 text-primary" />
                  Savor the nuances of premium chocolate, combined with a
                  variety of flavors and textures.
                </span>
                <span>
                  <CheckIcon className="inline-block h-4 w-4 mr-1 text-primary" />
                  Unwrap happiness with every indulgent bite.
                </span>
              </CardDescription>
            </Link>
          </CardContent>
          <CardFooter className="md:hidden flex justify-center p-4 mt-auto">
            <Link
              href="/chocolates"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
            >
              Discover Now
              <span className="sr-only">Discover</span>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-1 w-full overflow-hidden rounded-xl md:hover:scale-[1.01] md:hover:shadow-lg transition-all duration-300 xl:flex-row flex-col">
          <CardHeader className="p-0 border-r xl:w-[35%] space-y-0">
            <Link className="w-full" href="/breads">
              <div className="xl:block hidden">
                <AspectRatio ratio={3 / 5}>
                  <Image
                    src="/products/sourdough.webp"
                    alt="Einkorn"
                    className="object-cover"
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                    fill
                    loading="lazy"
                  />
                </AspectRatio>
              </div>
              <div className="xl:hidden block">
                <AspectRatio ratio={2 / 1}>
                  <Image
                    src="/products/sourdough.webp"
                    alt="Einkorn"
                    className="object-cover"
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                    fill
                    loading="lazy"
                  />
                </AspectRatio>
              </div>
            </Link>
          </CardHeader>
          <CardContent className="p-4 xl:w-[65%]">
            <Link className="w-full" href="/breads">
              <CardTitle className="text-xl font-bold leading-tight tracking-tighter">
                Homemade Sourdough Breads
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground/90 my-2 flex flex-col gap-2">
                <span>
                  <CheckIcon className="inline-block h-4 w-4 mr-1 text-primary" />
                  Crafted with care and patience, our sourdough breads offer a
                  rustic crust and airy crumb.
                </span>
                <span>
                  <CheckIcon className="inline-block h-4 w-4 mr-1 text-primary" />
                  Each bite is a journey through rich, tangy flavors of
                  naturally fermented dough.
                </span>
                <span>
                  <CheckIcon className="inline-block h-4 w-4 mr-1 text-primary" />
                  Made from a cherished family recipe, embodying tradition and
                  taste.
                </span>
                <span>
                  <CheckIcon className="inline-block h-4 w-4 mr-1 text-primary" />
                  Versatile, perfect for toasting at breakfast or complementing
                  your favorite dishes.
                </span>
                <span>
                  <CheckIcon className="inline-block h-4 w-4 mr-1 text-primary" />
                  Brings the warmth and aroma of a traditional bakery straight
                  to your home.
                </span>
              </CardDescription>
            </Link>
          </CardContent>
          <CardFooter className="md:hidden flex justify-center p-4 mt-auto">
            <Link
              href="/breads"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
            >
              Discover Now
              <span className="sr-only">Discover</span>
            </Link>
          </CardFooter>
        </Card>
      </section>
    </Shell>
  );
}
