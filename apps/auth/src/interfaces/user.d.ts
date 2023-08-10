import { z } from 'zod';
import { signupSchema } from '../schemas/user';

type Signup = z.infer<typeof signupSchema>['body'];

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

export { Signup, NewUser, InserNewUser };
