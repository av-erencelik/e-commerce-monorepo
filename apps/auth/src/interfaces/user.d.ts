import { z } from 'zod';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/user';
import { InferModel } from 'drizzle-orm';
import { users } from '../models/schema';
import { verifyTokenSchema } from '../schemas/token';

type Signup = z.infer<typeof signupSchema>['body'];
type Login = z.infer<typeof loginSchema>['body'];
type User = InferModel<typeof users, 'select'>;
type Token = z.infer<typeof verifyTokenSchema>['query'];

interface NewUser {
  email: string;
  password: string;
  phoneNumber: string;
  fullName: string;
  countryCode: string;
}

interface InsertNewUser extends NewUser {
  userId: string;
}

type ForgotPassword = z.infer<typeof forgotPasswordSchema>['body'];

type ResetPassword = z.infer<typeof resetPasswordSchema>['body'];

export {
  Signup,
  NewUser,
  InserNewUser,
  Login,
  User,
  Token,
  ForgotPassword,
  ResetPassword,
};
