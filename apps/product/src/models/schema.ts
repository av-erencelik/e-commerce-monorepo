import { sql } from 'drizzle-orm';
import {
  mysqlTableCreator,
  varchar,
  int,
  boolean,
  index,
  smallint,
  datetime,
  text,
  double,
} from 'drizzle-orm/mysql-core';

export const mysqlTable = mysqlTableCreator((name) => `product_${name}`);

export const product = mysqlTable(
  'product',
  {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 256 }).unique().notNull(),
    description: text('description').notNull(),
    version: smallint('version').notNull().default(0),
    stock: smallint('stock').notNull().default(0),
    dailySales: smallint('daily_sales').notNull().default(0),
    weight: smallint('weight'),
    createdAt: datetime('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    categoryId: int('category_id').notNull(),
    subCategoryId: int('sub_category_id').notNull(),
  },
  (table) => ({
    createdAtIdx: index('created_at_idx').on(table.createdAt),
    categoryIdIdx: index('category_id_idx').on(table.categoryId),
    subCategoryIdIdx: index('sub_category_id_idx').on(table.subCategoryId),
  })
);

export const productPrice = mysqlTable(
  'product_price',
  {
    id: int('id').primaryKey().autoincrement(),
    productId: int('product_id').notNull(),
    price: double('price', { precision: 10, scale: 2 }).notNull(),
    originalPrice: double('original_price', {
      precision: 10,
      scale: 2,
    }).notNull(),
    version: smallint('version').notNull().default(0),
    startDate: datetime('start_date').notNull(),
    endDate: datetime('end_date').notNull(),
  },
  (table) => ({
    productIdIdx: index('product_id_idx').on(table.productId),
    priceIdx: index('price_idx').on(table.price),
    dateIdx: index('date_idx').on(table.startDate, table.endDate),
  })
);

export const category = mysqlTable('category', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  description: varchar('description', { length: 255 }).notNull(),
});

export const subCategory = mysqlTable(
  'sub_category',
  {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).unique().notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    categoryId: int('category_id').notNull(),
  },
  (table) => ({
    categoryIdIdx: index('category_id_idx').on(table.categoryId),
  })
);
export const image = mysqlTable(
  'image',
  {
    id: int('id').primaryKey().autoincrement(),
    productId: int('product_id').notNull(),
    key: varchar('key', { length: 255 }).unique().notNull(),
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
    isFeatured: boolean('is_featured').notNull().default(false),
  },
  (table) => ({
    isBooleanIdx: index('is_featured_idx').on(table.isFeatured),
    keyIdx: index('key_idx').on(table.key),
  })
);
