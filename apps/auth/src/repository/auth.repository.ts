import { eq } from 'drizzle-orm';
import db from '../database';
import { users } from '../models/user';

const getUser = async (email: string) => {
  return await db.select().from(users).where(eq(users.email, email)).limit(1);
};

export default Object.freeze({
  getUser,
});
