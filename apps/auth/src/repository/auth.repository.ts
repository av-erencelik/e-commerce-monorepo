import { eq, or } from 'drizzle-orm';
import db from '../database';
import { users } from '../models/user';
import { InserNewUser } from '../interfaces/user';

const checkUserExists = async (email: string, phoneNumber: string) => {
  return await db
    .select()
    .from(users)
    .where(or(eq(users.email, email), eq(users.phoneNumber, phoneNumber)));
};

const createUser = async (newUser: InserNewUser) => {
  const { email, password, phoneNumber, fullName, countryCode, userId } =
    newUser;
  await db
    .insert(users)
    .values({ email, password, phoneNumber, fullName, countryCode, userId });

  const user = await db
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .select({ userId: users.userId, email: users.email })
    .from(users);

  return user[0];
};

const getCurrentUser = async (id: string) => {
  const user = await db.select().from(users).where(eq(users.userId, id));
  return user[0];
};

export default Object.freeze({
  checkUserExists,
  createUser,
  getCurrentUser,
});
