// db schema for order - shopping cart and checkout
import { sql } from 'drizzle-orm';
import {
  mysqlTableCreator,
  varchar,
  int,
  index,
  smallint,
  datetime,
  double,
  char,
  uniqueIndex,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

export const mysqlTable = mysqlTableCreator((name) => `shop_${name}`);

// product related duplicate of product service schema with only the fields needed for order

export const product = mysqlTable('product', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }).unique().notNull(),
  version: smallint('version').notNull(),
  stock: smallint('stock').notNull(),
  createdAt: datetime('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  image: varchar('image', { length: 256 }).notNull(),
});

export const productPrice = mysqlTable(
  'product_price',
  {
    id: int('id').primaryKey().autoincrement(),
    productId: int('product_id').notNull(),
    price: double('price', { precision: 10, scale: 2 }).notNull(),
    startDate: datetime('start_date').notNull(),
    endDate: datetime('end_date').notNull(),
  },
  (table) => ({
    productIdIdx: index('product_id_idx').on(table.productId),
    dateIdx: index('date_idx').on(table.startDate, table.endDate),
  })
);

// shopping cart related schema

export const cart = mysqlTable(
  'cart',
  {
    id: varchar('id', { length: 36 }).primaryKey().notNull(),
    userId: char('user_id', { length: 12 }).unique(),
    createdAt: datetime('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
  })
);

export const cartItem = mysqlTable(
  'cart_item',
  {
    id: int('id').primaryKey().autoincrement(),
    cartId: varchar('cart_id', { length: 36 }).notNull(),
    productId: int('product_id').notNull(),
    quantity: int('quantity').notNull(),
  },
  (table) => ({
    cartIdIdx: index('cart_id_idx').on(table.cartId),
    productIdIdx: index('product_id_idx').on(table.productId),
    itemIdx: uniqueIndex('item_idx').on(table.cartId, table.productId),
  })
);

// order related schema

export const order = mysqlTable(
  'order',
  {
    id: varchar('id', { length: 36 }).primaryKey().notNull(),
    userId: char('user_id', { length: 12 }).notNull(),
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP`),
    totalAmount: double('total_amount', { precision: 10, scale: 2 }).notNull(),
    status: mysqlEnum('status', ['pending', 'paid', 'not confirmed']).notNull(),
    paymentIntentId: varchar('payment_intent_id', { length: 36 }),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
  })
);

export const orderItem = mysqlTable(
  'order_item',
  {
    id: int('id').primaryKey().autoincrement(),
    orderId: varchar('order_id', { length: 36 }).notNull(),
    productId: int('product_id').notNull(),
    productName: varchar('product_name', { length: 256 }).notNull(),
    quantity: int('quantity').notNull(),
    price: double('price', { precision: 10, scale: 2 }).notNull(),
    image: varchar('image', { length: 256 }).notNull(),
  },
  (table) => ({
    orderIdIdx: index('order_id_idx').on(table.orderId),
    productIdIdx: index('product_id_idx').on(table.productId),
  })
);

// payment related schema

export const payment = mysqlTable(
  'payment',
  {
    id: int('id').primaryKey().autoincrement(),
    orderId: varchar('order_id', { length: 36 }).notNull(),
    stripeId: varchar('stripe_id', { length: 36 }).notNull(),
    amount: double('amount', { precision: 10, scale: 2 }).notNull(),
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    orderIdIdx: index('order_id_idx').on(table.orderId),
  })
);
