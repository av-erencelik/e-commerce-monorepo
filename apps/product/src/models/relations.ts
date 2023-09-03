import { relations } from 'drizzle-orm';
import { category, image, product, review, productPrice } from './schema';

export const productRelations = relations(product, ({ one, many }) => ({
  price: many(productPrice),
  images: many(image),
  reviews: many(review),
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
}));

export const productPriceRelations = relations(productPrice, ({ one }) => ({
  product: one(product, {
    fields: [productPrice.productId],
    references: [product.id],
  }),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  many: many(product),
}));

export const imageRelations = relations(image, ({ one }) => ({
  product: one(product, {
    fields: [image.productId],
    references: [product.id],
  }),
}));

export const reviewRelations = relations(review, ({ one }) => ({
  product: one(product, {
    fields: [review.productId],
    references: [product.id],
  }),
}));
