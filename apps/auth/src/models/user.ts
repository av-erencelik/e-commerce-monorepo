import { int, mysqlTableCreator, varchar } from 'drizzle-orm/mysql-core';

export const mysqlTable = mysqlTableCreator((name) => `auth_${name}`);

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  password: varchar('password', { length: 64 }).notNull(),
});
