import { relations } from 'drizzle-orm';
import {
  cart,
  cartItem,
  order,
  orderItem,
  payment,
  product,
  productPrice,
} from './schema';

export const cartRelations = relations(cart, ({ many }) => ({
  cartItems: many(cartItem),
}));

export const productRelations = relations(product, ({ many }) => ({
  price: many(productPrice),
  cartItem: many(cartItem),
  orderItem: many(orderItem),
}));

export const productPriceRelations = relations(productPrice, ({ one }) => ({
  product: one(product, {
    fields: [productPrice.productId],
    references: [product.id],
  }),
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItem.cartId],
    references: [cart.id],
  }),
  product: one(product, {
    fields: [cartItem.productId],
    references: [product.id],
  }),
}));

export const orderRelations = relations(order, ({ many }) => ({
  orderItem: many(orderItem),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
  order: one(order, {
    fields: [payment.orderId],
    references: [order.id],
  }),
}));
