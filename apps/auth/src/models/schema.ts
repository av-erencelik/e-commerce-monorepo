import {
  mysqlTableCreator,
  varchar,
  char,
  int,
  boolean,
  uniqueIndex,
  smallint,
  datetime,
} from 'drizzle-orm/mysql-core';

export const mysqlTable = mysqlTableCreator((name) => `auth_${name}`);

export const users = mysqlTable(
  'users',
  {
    id: int('id').primaryKey().autoincrement(),
    userId: char('user_id', { length: 12 }).notNull().unique(),
    fullName: varchar('full_name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).unique().notNull(),
    password: char('password', { length: 64 }).notNull(),
    phoneNumber: varchar('phone_number', { length: 16 }).unique().notNull(),
    countryCode: char('country_code', { length: 2 }).notNull(),
    verificated: boolean('verificated').notNull().default(false),
    version: smallint('version').notNull().default(0),
    isAdmin: boolean('is_admin').notNull().default(false),
  },
  (table) => ({
    emailIdx: uniqueIndex('email_idx').on(table.email),
    phoneNumberIdx: uniqueIndex('phone_number_idx').on(table.phoneNumber),
    userIdIdx: uniqueIndex('user_id_idx').on(table.userId),
  })
);

export const passwordReset = mysqlTable(
  'password_reset',
  {
    id: int('id').primaryKey().autoincrement(),
    userId: char('user_id', { length: 12 }).notNull().unique(),
    token: varchar('token', { length: 64 }).notNull(),
    expiresAt: datetime('expires_at').notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex('user_id_idx').on(table.userId),
    tokenIdx: uniqueIndex('token_idx').on(table.token),
  })
);
