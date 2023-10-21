'use client';

import { getOrders } from '@client/lib/api/auth-service';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import OrderItem from './order-item';
import Link from 'next/link';
import { buttonVariants, cn } from '@e-commerce-monorepo/ui';

const UserOrders = () => {
  const { data, isLoading, isError } = useQuery(['user-orders'], getOrders);

  if (isLoading) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">My Orders</h3>
        <div className="w-full border rounded-md h-64 flex justify-center items-center flex-col gap-3">
          <Loader2 size={48} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">My Orders</h3>
      <section className="flex flex-col gap-3">
        {data.data.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
        {data.data.length === 0 && (
          <div className="w-full border rounded-md h-64 flex justify-center items-center flex-col gap-3">
            <p className="text-sm">You have no orders yet.</p>
            <Link href="/" className={cn(buttonVariants())}>
              Start Shopping
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserOrders;
