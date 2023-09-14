import { and, eq } from 'drizzle-orm';
import db from '../database/sql';
import { cart, cartItem, product, productPrice } from '../models/schema';
import { AccessTokenPayload } from '@e-commerce-monorepo/utils';
import {
  ProductCreatedPayload,
  ProductPriceUpdatedPayload,
  ProductStockUpdatedPayload,
  ProductUpdatedPayload,
} from '@e-commerce-monorepo/event-bus';

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

// product

const createProduct = async (createdProduct: ProductCreatedPayload) => {
  await db.insert(product).values({
    id: createdProduct.id,
    name: createdProduct.name,
    image: createdProduct.image,
    stock: createdProduct.stock,
    version: createdProduct.version,
  });

  await db.insert(productPrice).values({
    productId: createdProduct.id,
    price: createdProduct.price,
    startDate: new Date(createdProduct.startDate),
    endDate: new Date(createdProduct.endDate),
  });
};

const getProductById = async (productId: number) => {
  const productItem = await db
    .select()
    .from(product)
    .where(eq(product.id, productId));
  return productItem.length > 0 ? productItem[0] : null;
};

const getProductPriceById = async (id: number) => {
  const price = await db
    .select()
    .from(productPrice)
    .where(eq(productPrice.id, id));

  return price.length > 0 ? price[0] : null;
};

const updateProduct = async (updatedProduct: ProductUpdatedPayload) => {
  await db
    .update(product)
    .set({
      image: updatedProduct.image,
      stock: updatedProduct.stock,
      version: updatedProduct.version,
      name: updatedProduct.name,
    })
    .where(eq(product.id, updatedProduct.id));

  await db
    .update(productPrice)
    .set({
      endDate: new Date(updatedProduct.startDate),
    })
    .where(eq(productPrice.productId, updatedProduct.priceId));

  await db.insert(productPrice).values({
    productId: updatedProduct.id,
    price: updatedProduct.price,
    startDate: new Date(updatedProduct.startDate),
    endDate: new Date(updatedProduct.endDate),
  });
};

const updateProductPrice = async (updatedPrice: ProductPriceUpdatedPayload) => {
  await db
    .update(productPrice)
    .set({
      endDate: new Date(updatedPrice.startDate),
    })
    .where(
      and(
        eq(productPrice.productId, updatedPrice.productId),
        eq(productPrice.endDate, new Date('9999-12-31'))
      )
    );

  await db.insert(productPrice).values({
    productId: updatedPrice.productId,
    price: updatedPrice.price,
    startDate: new Date(updatedPrice.startDate),
    endDate: new Date(updatedPrice.endDate),
  });

  await db.insert(productPrice).values({
    productId: updatedPrice.productId,
    price: updatedPrice.originalPrice,
    startDate: new Date(updatedPrice.endDate),
    endDate: new Date('9999-12-31'),
  });
};

const deleteProduct = async (productId: number) => {
  await db.delete(product).where(eq(product.id, productId));
  await db.delete(productPrice).where(eq(productPrice.productId, productId));
  await db.delete(cartItem).where(eq(cartItem.productId, productId));
};

const deleteProductPrice = async (priceId: number) => {
  await db.delete(productPrice).where(eq(productPrice.id, priceId));
};

const reStockProducts = async (data: ProductStockUpdatedPayload) => {
  await db.transaction(async (trx) => {
    for (const item of data.products) {
      await trx
        .update(product)
        .set({
          stock: item.stock,
        })
        .where(eq(product.id, item.id));
    }
  });
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
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductPriceById,
  deleteProductPrice,
  updateProductPrice,
  reStockProducts,
});
