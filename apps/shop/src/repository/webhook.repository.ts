import { eq } from 'drizzle-orm';
import db from '../database/sql';
import { order, payment } from '../models/schema';

const updateOrderStatusToPending = async (orderId: string) => {
  await db
    .update(order)
    .set({ status: 'pending' })
    .where(eq(order.id, orderId));
};

const updateOrderStatusToPaid = async (
  orderId: string,
  paymentId: string,
  amount: number
) => {
  await db.update(order).set({ status: 'paid' }).where(eq(order.id, orderId));
  await db.insert(payment).values({ stripeId: paymentId, orderId, amount });
};

export default Object.freeze({
  updateOrderStatusToPending,
  updateOrderStatusToPaid,
});
