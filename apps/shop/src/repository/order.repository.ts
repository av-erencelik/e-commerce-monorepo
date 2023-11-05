import { AccessTokenPayload } from '@e-commerce-monorepo/utils';
import db from '../database/sql';
import httpStatus from 'http-status';
import { ApiError } from '@e-commerce-monorepo/errors';
import { cartItem, order, orderItem, product } from '../models/schema';
import { v4 as uuid } from 'uuid';
import { and, eq, sql } from 'drizzle-orm';
import stripe from '../libs/stripe';
import { expirationQueue } from '../event-bus/bull-queue/expiration-queue';
import { OrderCancelled } from '@e-commerce-monorepo/event-bus';

const createOrder = async (cartId: string, user: AccessTokenPayload) => {
  const result = await db.transaction(async (trx) => {
    const cart = await trx.query.cart.findFirst({
      with: {
        cartItems: {
          with: {
            product: {
              with: {
                price: {
                  where: (price, { sql, and }) =>
                    and(
                      sql`${price.startDate} < ${new Date()}`,
                      sql`${price.endDate} > ${new Date()}`
                    ),
                  limit: 1,
                },
              },
            },
          },
        },
      },
      where(fields, { eq }) {
        return eq(fields.id, cartId);
      },
    });

    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }

    const total = cart.cartItems.reduce(
      (acc, item) => acc + item.product.price[0].price * item.quantity,
      0
    );

    const orderId = uuid();

    await trx.insert(order).values({
      id: orderId,
      userId: user.userId,
      totalAmount: total,
      status: 'not confirmed',
    });

    // check if product is still available on stock cart.cartItems

    const outOfStockItems: Array<{ cartId: string; productId: number }> = [];

    for (const cartItem of cart.cartItems) {
      if (cartItem.product.stock < cartItem.quantity) {
        outOfStockItems.push({
          cartId: cartItem.cartId,
          productId: cartItem.productId,
        });
      }
      await trx.insert(orderItem).values({
        orderId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: cartItem.product.price[0].price,
        image: cartItem.product.image,
        productName: cartItem.product.name,
      });

      await trx
        .update(product)
        .set({
          stock: cartItem.product.stock - cartItem.quantity,
        })
        .where(eq(product.id, cartItem.productId));
    }

    if (outOfStockItems.length > 0) {
      await trx.rollback();
      return {
        status: false,
        outOfStockItems,
      };
    }

    const intent = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: 'usd',
      description: `Order ${orderId} by ${user.userId}`,
      payment_method_types: ['card'],
      metadata: {
        orderId,
      },
    });

    await trx
      .update(order)
      .set({
        paymentIntentId: intent.id,
      })
      .where(eq(order.id, orderId));

    const createdOrder = await trx
      .select()
      .from(order)
      .where(eq(order.id, orderId));

    expirationQueue.add(
      {
        orderId: orderId,
      },
      {
        delay: 1000 * 60 * 15,
      }
    );

    return {
      status: true,
      clientSecret: intent.client_secret,
      order: createdOrder[0],
    };
  });

  if (!result.status && result.outOfStockItems) {
    result.outOfStockItems.forEach(async (item) => {
      await db
        .delete(cartItem)
        .where(
          and(
            eq(cartItem.cartId, item.cartId),
            eq(cartItem.productId, item.productId)
          )
        );
    });
  }

  return result;
};

const getOrders = async (user: AccessTokenPayload) => {
  const orders = await db.query.order.findMany({
    where: (fields, { eq, and, sql }) =>
      and(
        eq(fields.userId, user.userId),
        sql`${fields.createdAt} > ${new Date(
          new Date().getTime() - 30 * 24 * 60 * 60 * 1000
        )}`
      ),
    orderBy: (fields, { desc }) => desc(fields.createdAt),
    with: {
      orderItem: true,
    },
  });
  return orders;
};

const getOrder = async (orderId: string) => {
  const order = await db.query.order.findFirst({
    where: (fields, { eq }) => eq(fields.id, orderId),
    with: {
      orderItem: true,
    },
  });
  return order;
};

const deleteOrder = async (orderId: string) => {
  const existingOrder = await db.query.order.findFirst({
    where: (fields, { eq }) => eq(fields.id, orderId),
    with: {
      orderItem: true,
    },
  });
  if (
    existingOrder &&
    existingOrder.status === 'not confirmed' &&
    existingOrder.paymentIntentId
  ) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      existingOrder.paymentIntentId
    );
    if (paymentIntent.status === 'succeeded') {
      return;
    }
    await stripe.paymentIntents.cancel(existingOrder.paymentIntentId);

    // all order items stock must be restored
    for (const orderItem of existingOrder.orderItem) {
      await db
        .update(product)
        .set({
          stock: sql`${product.stock} + ${orderItem.quantity}`,
        })
        .where(eq(product.id, orderItem.productId));
    }
  } else {
    return;
  }
  await db.delete(order).where(eq(order.id, orderId));
  await db.delete(orderItem).where(eq(orderItem.orderId, orderId));

  const orderCancelledEvent = new OrderCancelled();
  orderCancelledEvent.publish({
    orderId: orderId,
    products: existingOrder.orderItem.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
    })),
  });
};

const makeOrderStatusPending = async (orderId: string) => {
  await db
    .update(order)
    .set({
      status: 'pending',
    })
    .where(eq(order.id, orderId));
};

const addImageUrlToOrderItem = async (productId: number, url: string) => {
  await db
    .update(orderItem)
    .set({
      imageUrl: url,
    })
    .where(eq(orderItem.productId, productId));
};

export default Object.freeze({
  createOrder,
  getOrders,
  getOrder,
  deleteOrder,
  makeOrderStatusPending,
  addImageUrlToOrderItem,
});
