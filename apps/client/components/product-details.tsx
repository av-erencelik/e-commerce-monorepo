import { capitalizeFirstLetter } from '@client/lib/utils';
import { Product } from '@client/types/column';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@e-commerce-monorepo/ui';
import { Banknote, Dumbbell, LineChart, Refrigerator } from 'lucide-react';
import React from 'react';

type ProductDetailsProps = {
  product: Product;
};

const ProductDetails = ({ product }: ProductDetailsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock</CardTitle>
          <Refrigerator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {product.stock} {capitalizeFirstLetter(product.name)}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Price</CardTitle>
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'USD',
            }).format(product.price[0].price)}

            {product.price[0].price !== product.price[0].originalPrice && (
              <span className="text-muted">
                {new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'USD',
                }).format(product.price[0].originalPrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weight</CardTitle>
          <Dumbbell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {product.weight ? product.weight + ' gr' : 'Not specified'}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {product.dailySales} {capitalizeFirstLetter(product.name)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;
