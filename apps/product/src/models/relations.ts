import { relations } from 'drizzle-orm';
import { category, image, product, productPrice, subCategory } from './schema';

export const productRelations = relations(product, ({ one, many }) => ({
  price: many(productPrice),
  images: many(image),
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  subCategory: one(subCategory, {
    fields: [product.subCategoryId],
    references: [subCategory.id],
  }),
}));

export const productPriceRelations = relations(productPrice, ({ one }) => ({
  product: one(product, {
    fields: [productPrice.productId],
    references: [product.id],
  }),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  product: many(product),
  subCategories: many(subCategory),
}));

export const subCategoryRelations = relations(subCategory, ({ one, many }) => ({
  category: one(category, {
    fields: [subCategory.categoryId],
    references: [category.id],
  }),
  product: many(product),
}));

export const imageRelations = relations(image, ({ one }) => ({
  product: one(product, {
    fields: [image.productId],
    references: [product.id],
  }),
}));
