import { sql } from 'drizzle-orm';
import {
  mysqlTableCreator,
  varchar,
  char,
  int,
  boolean,
  index,
  smallint,
  datetime,
  decimal,
  text,
  unique,
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
    weight: smallint('weight'),
    createdAt: datetime('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    categoryId: int('category_id').notNull(),
  },
  (table) => ({
    createdAt: index('created_at_idx').on(table.createdAt),
  })
);

export const productPrice = mysqlTable(
  'product_price',
  {
    id: int('id').primaryKey().autoincrement(),
    productId: int('product_id').notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal('original_price', {
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
  name: varchar('name', { length: 256 }).unique().notNull(),
  description: varchar('description', { length: 256 }).notNull(),
});

export const review = mysqlTable(
  'review',
  {
    id: int('id').primaryKey().autoincrement(),
    productId: int('product_id').notNull(),
    userId: char('user_id', { length: 12 }).notNull(),
    rating: smallint('rating').notNull(),
    comment: varchar('comment', { length: 256 }).notNull(),
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    productIdIdx: index('product_id_idx').on(table.productId),
    userIdIdx: index('user_id_idx').on(table.userId),
    createdAt: index('created_at_idx').on(table.createdAt),
    unq: unique().on(table.productId, table.userId),
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
