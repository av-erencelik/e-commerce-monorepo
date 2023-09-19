import { AccessTokenPayload } from '@e-commerce-monorepo/utils';
import db from '../database/sql';
import httpStatus from 'http-status';
import { ApiError } from '@e-commerce-monorepo/errors';
import { cartItem, order, orderItem, payment, product } from '../models/schema';
import { v4 as uuid } from 'uuid';
import { and, eq } from 'drizzle-orm';
import stripe from '../libs/stripe';

const createOrder = async (
  cartId: string,
  user: AccessTokenPayload,
  token: string
) => {
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

    try {
      const charge = await stripe.charges.create({
        amount: total * 100,
        currency: 'usd',
        source: token,
        description: `Order ${orderId}`,
      });
      await trx.insert(payment).values({
        id: uuid(),
        orderId,
        stripeId: charge.id,
        amount: total,
      });
    } catch (e) {
      await trx.rollback();
      return {
        status: false,
        outOfStockItems,
      };
    }

    const createdOrder = await trx
      .select()
      .from(order)
      .where(eq(order.id, orderId));

    return {
      status: true,
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
    with: {
      orderItem: true,
    },
  });
  return orders;
};

export default Object.freeze({
  createOrder,
  getOrders,
});
