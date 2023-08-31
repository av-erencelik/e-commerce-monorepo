import { relations } from 'drizzle-orm';
import { passwordReset, users } from './schema';

export const usersRelations = relations(users, ({ one }) => ({
  passwordReset: one(passwordReset, {
    fields: [users.userId],
    references: [passwordReset.userId],
  }),
}));
