import { formatPrice } from '@client/lib/utils';
import { OrderItem } from '@client/types';
import { Separator } from '@e-commerce-monorepo/ui';
import Image from 'next/image';
import React from 'react';

type CheckoutItemsProps = {
  items: OrderItem[];
};

const CheckoutItems = ({ items }: CheckoutItemsProps) => {
  return (
    <div className="container hidden w-full max-w-xl lg:ml-auto lg:mr-0 lg:flex lg:max-h-[580px] lg:pr-[4.5rem]">
      <section className="flex flex-col gap-8 lg:gap-16 w-full">
        {items.map((item) => (
          <>
            <div key={item.id} className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      fill
                      className="absolute object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col space-y-1 self-start">
                    <span className="line-clamp-1 text-sm font-medium">
                      {item.productName}
                    </span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      Qty {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 font-medium">
                  <span className="ml-auto line-clamp-1 text-sm">
                    {formatPrice(
                      (Number(item.price) * item.quantity).toFixed(2)
                    )}
                  </span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {formatPrice(item.price)} each
                  </span>
                </div>
              </div>
              <Separator />
            </div>
          </>
        ))}
      </section>
    </div>
  );
};

export default CheckoutItems;
