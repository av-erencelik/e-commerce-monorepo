import AddToCartWithQuantity from '@client/components/buttons/add-to-cart-button-with-quantity';
import ProductCard from '@client/components/cards/product-card';
import { Breadcrumb } from '@client/components/navigation/breadcrumb';
import ProductImageCarousel from '@client/components/product-carousel';
import { getProduct } from '@client/lib/api/api-service';
import {
  getBreadsProducts,
  getChocolateProducts,
} from '@client/lib/api/product';
import { formatPrice } from '@client/lib/utils';
import {
  Shell,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@e-commerce-monorepo/ui';
import {
  BriefcaseIcon,
  CreditCardIcon,
  SproutIcon,
  TruckIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { productId } = params;
  const product = await getProduct(productId);
  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.description,
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = params;
  const product = await getProduct(productId);
  if (!product) {
    notFound();
  }
  const { products: similarProducts } =
    product.categoryId === 1
      ? await getBreadsProducts({
          subcategory: product.subCategory.id.toString(),
        })
      : await getChocolateProducts({
          subcategory: product.subCategory.id.toString(),
        });
  return (
    <Shell>
      <Breadcrumb
        segments={[
          {
            title: product.category.name,
            href: product.categoryId === 1 ? '/breads' : '/chocolates',
          },
          {
            title: product.subCategory.name,
            href:
              product.categoryId === 1
                ? `/breads?subcategory_id=${product.subCategory.id}`
                : `/chocolates?subcategory_id=${product.subCategory.id}`,
          },
          {
            title: product.name,
            href: `/product/${product.id}`,
          },
        ]}
      />
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16 rounded-lg border border-border lg:p-8 p-2 shadow-md">
        <ProductImageCarousel
          images={product.images}
          options={{
            loop: true,
          }}
          className="w-full lg:w-1/3 border"
        />
        <div className="space-y-3 w-full lg:w-1/3">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold">
              {product.name} {product.weight && ` (${product.weight} Gr)`}
            </h2>
            <div className="text-sm">
              <span className="mr-2">Category:</span>
              <Link
                href={
                  product.categoryId === 1
                    ? `/breads?subcategory_id=${product.subCategory.id}`
                    : `/chocolates?subcategory_id=${product.subCategory.id}`
                }
                className="text-muted-foreground underline"
              >
                {product.subCategory.name}
              </Link>
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {product.description ??
                  'No description is available for this product.'}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="space-y-2">
            <h4 className="line-clamp-1 text-base font-semibold">
              Our Offers:
            </h4>
            <div className="grid grid-cols-2 gap-3 md:gap-5">
              <div className="gap-2 md:gap-5 flex items-center">
                <div className="p-2 max-w-fit rounded-full bg-muted border">
                  <SproutIcon
                    className="md:h-8 md:w-8 h-6 w-6 text-primary"
                    strokeWidth={1}
                  />
                </div>
                <p className="text-xs md:text-sm font-medium">
                  100% Natural Products
                </p>
              </div>
              <div className="gap-2 md:gap-5 flex items-center">
                <div className="p-2 max-w-fit rounded-full bg-muted border">
                  <TruckIcon
                    className="md:h-8 md:w-8 h-6 w-6 text-primary"
                    strokeWidth={1}
                  />
                </div>
                <p className="text-xs md:text-sm font-medium">
                  Free shipping over $60
                </p>
              </div>
              <div className="gap-2 md:gap-5 flex items-center">
                <div className="p-2 max-w-fit rounded-full bg-muted border">
                  <BriefcaseIcon
                    className="md:h-8 md:w-8 h-6 w-6 text-primary"
                    strokeWidth={1}
                  />
                </div>
                <p className="text-xs md:text-sm font-medium">
                  Same Day Shipping
                </p>
              </div>
              <div className="gap-2 md:gap-5 flex items-center">
                <div className="p-2 max-w-fit rounded-full bg-muted border">
                  <CreditCardIcon
                    className="md:h-8 md:w-8 h-6 w-6 text-primary"
                    strokeWidth={1}
                  />
                </div>
                <p className="text-xs md:text-sm font-medium">
                  Secure payment with Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 w-full lg:w-1/4">
          <div className="p-3 bg-muted border rounded-md space-y-2">
            <div>
              <h5 className="text-base font-semibold text-primary">Price:</h5>
              <p className="text-primary text-4xl font-bold">
                {formatPrice(product.price[0].price)}
              </p>
            </div>
            <AddToCartWithQuantity productId={product.id} />
          </div>
        </div>
      </div>
      {similarProducts.length > 1 && (
        <div className="overflow-hidden md:pt-6">
          <h2 className="line-clamp-1 flex-1 text-2xl font-bold">
            More products from {product.subCategory.name}
          </h2>
          <div className="overflow-x-auto pb-2 pt-6">
            <div className="flex w-fit gap-4">
              {similarProducts.map((product) => {
                if (product.id.toString() === productId) {
                  return null;
                }
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className="min-w-[260px]"
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
};

export default ProductPage;
