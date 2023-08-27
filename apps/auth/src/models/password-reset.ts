import {
  mysqlTableCreator,
  varchar,
  char,
  int,
  uniqueIndex,
  datetime,
} from 'drizzle-orm/mysql-core';

export const mysqlTable = mysqlTableCreator((name) => `auth_${name}`);

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
