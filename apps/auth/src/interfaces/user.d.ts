import { z } from 'zod';
import { signupSchema, loginSchema } from '../schemas/user';
import { InferModel } from 'drizzle-orm';
import { users } from '../models/user';

type Signup = z.infer<typeof signupSchema>['body'];
type Login = z.infer<typeof loginSchema>['body'];
type User = InferModel<typeof users, 'select'>;

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

export { Signup, NewUser, InserNewUser, Login, User };
