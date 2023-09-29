import { formatPrice } from '@client/lib/utils';
import { Product } from '@client/types/column';
import {
  AspectRatio,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
} from '@e-commerce-monorepo/ui';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import AddToCartButton from '../buttons/add-to-cart-button';

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
}

const ProductCard = ({ product, className, ...props }: ProductCardProps) => {
  return (
    <Card
      className={cn(
        'h-full overflow-hidden rounded-xl hover:shadow-xl transition-shadow group flex flex-col',
        className
      )}
      {...props}
    >
      <Link href={`/product/${product.id}`}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            <Image
              src={product.images[0].url}
              alt={product.name}
              className="object-cover"
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              fill
              loading="lazy"
            />
          </AspectRatio>
        </CardHeader>
        <span className="sr-only">{product.name}</span>
      </Link>
      <Link href={`/product/${product.id}`} tabIndex={-1} title={product.name}>
        <CardContent className="grid gap-2.5 p-4">
          <CardTitle className="line-clamp-2 text-muted-foreground">
            {product.name}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {product.price[0].price !== product.price[0].originalPrice ? (
              <>
                <span className="text-success">
                  {formatPrice(product.price[0].price)}
                </span>
                <span className="line-through text-xs pl-1 text-muted-foreground">
                  {formatPrice(product.price[0].originalPrice)}
                </span>
              </>
            ) : (
              <span className="text-foreground">
                {formatPrice(product.price[0].price)}
              </span>
            )}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="p-4 mt-auto">
        <AddToCartButton
          productId={product.id}
          className="group-hover:opacity-100 md:opacity-0 opacity-100 transition-opacity"
        />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
