import { formatDate, formatPrice } from '@client/lib/utils';
import { Order } from '@client/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  buttonVariants,
  cn,
} from '@e-commerce-monorepo/ui';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type OrderItemProps = {
  order: Order;
};

const OrderItem = ({ order }: OrderItemProps) => {
  return (
    <div className="border rounded-md" aria-label="order">
      <div
        aria-label="order-header"
        className="border-b rounded-t-md p-4 items-center bg-muted/75 md:flex hidden"
      >
        <div
          aria-label="order-header-info"
          className="w-1/4 font-bold flex flex-col text-xs text-foreground/70"
        >
          Order Date
          <span className="font-normal whitespace-nowrap text-ellipsis w-32 text-foreground">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <div
          aria-label="order-header-info"
          className="w-1/4 font-bold flex flex-col text-xs text-foreground/70"
        >
          Order Summary
          <span className="font-normal whitespace-nowrap text-ellipsis w-32 text-foreground">
            {order.orderItem.length} Product
          </span>
        </div>
        <div
          aria-label="order-header-info"
          className="w-1/4 font-bold flex flex-col text-xs text-foreground/70"
        >
          Total
          <span className="font-normal whitespace-nowrap text-ellipsis w-32 text-foreground">
            {formatPrice(order.totalAmount)}
          </span>
        </div>
        {order.status === 'not confirmed' && (
          <Link
            href={`/checkout/${order.id}`}
            className={cn(buttonVariants({ size: 'sm' }), 'ml-auto')}
          >
            Pay
          </Link>
        )}
      </div>
      <div
        aria-label="order-header-mobile"
        className="border-b rounded-t-md p-4 items-center bg-muted/75 md:hidden flex"
      >
        <div className="font-bold flex flex-col text-xs gap-2">
          {formatDate(order.createdAt)}
          <div>
            Total:{' '}
            <span className="font-normal whitespace-nowrap text-ellipsis w-32 text-foreground">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
        {order.status === 'not confirmed' && (
          <Link
            href={`/checkout/${order.id}`}
            className={cn(buttonVariants({ size: 'sm' }), 'ml-auto')}
          >
            Pay
          </Link>
        )}
      </div>
      <div aria-label="order-list" className="p-5">
        <div
          aria-label="order-item"
          className="flex md:items-center md:border rounded-sm md:p-4 md:flex-row flex-col space-y-2 md:space-y-0"
        >
          <div aria-label="order-status" className="w-1/2 flex">
            <p
              className={cn(
                {
                  'text-destructive': order.status === 'not confirmed',
                  'text-success': order.status === 'paid',
                  'text-primary': order.status === 'pending',
                },
                'text-xs flex items-center'
              )}
            >
              {order.status === 'not confirmed' ? (
                <CrossCircledIcon className="w-4 h-4 mr-2" />
              ) : order.status === 'paid' ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Loader2 size={48} className="animate-spin text-primary" />
              )}
              {order.status
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                .join(' ')}
            </p>
          </div>
          <div
            aria-label="order-items-images"
            className="flex flex-1 items-center"
          >
            {order.orderItem.map((item, index) => {
              if (index > 4) return null;
              if (index === 3)
                return (
                  <div>
                    <div className="p-1 overflow-hidden border rounded-sm mr-4">
                      <div className="relative w-9 h-12 flex justify-center items-center bg-primary/50">
                        <p className="text-foreground text-xs font-bold">
                          +{order.orderItem.length - 3}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              return (
                <div
                  key={item.id}
                  aria-label="order-item-image"
                  className="p-1 overflow-hidden border rounded-sm mr-4"
                  title={item.productName}
                >
                  <div className="relative w-9 h-12 flex justify-center items-center">
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div aria-label="order-items-quantity" className="md:hidden block">
            <p className="text-xs text-foreground/70">
              {order.orderItem.length} Product
              {order.orderItem.length > 1 && 's'}
            </p>
          </div>
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full border-t">
        <AccordionItem value="products">
          <AccordionTrigger
            className={cn(
              'flex justify-center',
              buttonVariants({ variant: 'ghost' }),
              'hover:bg-muted/75'
            )}
          >
            Order Details
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-5 grid md:grid-cols-2 grid-cols-1 gap-1">
              {order.orderItem.map((item) => (
                <div key={item.id} className="flex border rounded-md p-5 gap-5">
                  <div
                    aria-label="item-details-image"
                    className="p-[0.1rem] overflow-hidden border rounded-sm"
                    title={item.productName}
                  >
                    <Link href={`/products/${item.productId}`}>
                      <div className="relative w-16 h-24 flex justify-center items-center">
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover rounded-sm"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="space-y-1 pt-1">
                    <Link
                      href={`/products/${item.productId}`}
                      className={cn(
                        buttonVariants({ variant: 'link' }),
                        'p-0 w-fit h-fit'
                      )}
                    >
                      <h4 className="whitespace-nowrap font-bold text-xs">
                        {item.productName}
                      </h4>
                    </Link>
                    <div className="text-xs font-bold flex gap-1 items-center">
                      <span>Quantity:</span>
                      <span className="line-clamp-1 text-xs text-muted-foreground font-normal">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="font-bold flex gap-1 items-center text-xs">
                      <span>Total:</span>
                      <span className="line-clamp-1 text-xs text-muted-foreground font-normal">
                        {formatPrice(item.price)} x {item.quantity} ={' '}
                        {formatPrice(
                          (Number(item.price) * Number(item.quantity)).toFixed(
                            2
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default OrderItem;
