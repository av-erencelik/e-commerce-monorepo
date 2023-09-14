import { and, eq } from 'drizzle-orm';
import db from '../database/sql';
import { cart, cartItem, product } from '../models/schema';
import { AccessTokenPayload } from '@e-commerce-monorepo/utils';

const checkCartExistsBySession = async (cartSession: string) => {
  const shoppingCart = await db
    .select()
    .from(cart)
    .where(eq(cart.id, cartSession));
  return shoppingCart.length > 0 ? shoppingCart[0] : null;
};

const checkProductExists = async (productId: number) => {
  const productItem = await db
    .select()
    .from(product)
    .where(eq(product.id, productId));
  return productItem.length > 0;
};

const checkProductExistsOnCart = async (
  productId: number,
  cartId: string
): Promise<boolean> => {
  const productItem = await db
    .select()
    .from(cartItem)
    .where(and(eq(cartItem.cartId, cartId), eq(cartItem.productId, productId)));
  return productItem.length > 0;
};

const getCartByUserId = async (userId: string) => {
  const shopCart = await db.select().from(cart).where(eq(cart.userId, userId));
  return shopCart.length > 0 ? shopCart[0] : null;
};

const createCart = async (id: string, user?: AccessTokenPayload) => {
  await db.insert(cart).values({
    id,
    userId: user ? user.userId : null,
  });
};

const addUserToCart = async (cartId: string, user: AccessTokenPayload) => {
  await db.update(cart).set({
    userId: user.userId,
  });
};

const addToCart = async (
  productId: number,
  quantity: number,
  cartId: string
) => {
  const item = await db
    .select()
    .from(cartItem)
    .where(and(eq(cartItem.cartId, cartId), eq(cartItem.productId, productId)));

  if (item.length > 0) {
    await db
      .update(cartItem)
      .set({
        quantity: item[0].quantity + quantity,
      })
      .where(eq(cartItem.id, item[0].id));
  } else {
    await db.insert(cartItem).values({
      cartId,
      productId,
      quantity,
    });
  }

  await db
    .update(cart)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(cart.id, cartId));
};

const getCart = async (cartId: string) => {
  const cart = await db.query.cart.findFirst({
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

  return cart;
};

const removeFromCart = async (productId: number, cartId: string) => {
  await db
    .delete(cartItem)
    .where(and(eq(cartItem.cartId, cartId), eq(cartItem.productId, productId)));
};

const updateCart = async (
  productId: number,
  quantity: number,
  cartId: string
) => {
  await db
    .update(cartItem)
    .set({
      quantity,
    })
    .where(and(eq(cartItem.cartId, cartId), eq(cartItem.productId, productId)));
};

export default Object.freeze({
  checkCartExistsBySession,
  checkProductExists,
  checkProductExistsOnCart,
  getCartByUserId,
  createCart,
  addToCart,
  getCart,
  addUserToCart,
  removeFromCart,
  updateCart,
});
