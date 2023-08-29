import { eq, or, sql } from 'drizzle-orm';
import db from '../database/sql';
import { users } from '../models/user';
import { InserNewUser, User } from '../interfaces/user';
import { passwordReset } from '../models/password-reset';

const checkUserExists = async (
  email: string,
  phoneNumber: string
): Promise<User | null> => {
  const user = await db
    .select()
    .from(users)
    .where(or(eq(users.email, email), eq(users.phoneNumber, phoneNumber)));
  return user.length > 0 ? user[0] : null;
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await db.select().from(users).where(eq(users.email, email));
  return user.length > 0 ? user[0] : null;
};

const createUser = async (newUser: InserNewUser) => {
  const { email, password, phoneNumber, fullName, countryCode, userId } =
    newUser;
  await db
    .insert(users)
    .values({ email, password, phoneNumber, fullName, countryCode, userId });

  const user = await db
    .select({
      userId: users.userId,
      email: users.email,
      verificated: users.verificated,
      fullName: users.fullName,
      version: users.version,
    })
    .from(users)
    .where(eq(users.email, email));

  return user[0];
};

const getCurrentUser = async (id: string) => {
  const user = await db.select().from(users).where(eq(users.userId, id));
  return user[0];
};

const verifyUser = async (email: string) => {
  await db
    .update(users)
    .set({ verificated: true, version: sql`${users.version} + 1` })
    .where(eq(users.email, email));
  const user = await db.select().from(users).where(eq(users.email, email));
  return user[0];
};

const setResetPasswordToken = async (
  user: User,
  token: string,
  expiresAt: Date
) => {
  await db.insert(passwordReset).values({
    userId: user.userId,
    token,
    expiresAt,
  });
};

const getResetPasswordToken = async (id: string) => {
  const passwordResetToken = await db
    .select()
    .from(passwordReset)
    .where(eq(passwordReset.userId, id));
  if (passwordResetToken.length === 0) {
    return null;
  }
  return passwordResetToken[0];
};

const updatePassword = async (userId: string, password: string) => {
  await db.update(users).set({ password }).where(eq(users.userId, userId));
};

const deleteResetPasswordToken = async (userId: string) => {
  await db.delete(passwordReset).where(eq(passwordReset.userId, userId));
  const user = await db
    .select({ email: users.email, fullName: users.fullName })
    .from(users)
    .where(eq(users.userId, userId));
  return user[0];
};

export default Object.freeze({
  checkUserExists,
  createUser,
  getCurrentUser,
  getUserByEmail,
  verifyUser,
  setResetPasswordToken,
  getResetPasswordToken,
  updatePassword,
  deleteResetPasswordToken,
});
