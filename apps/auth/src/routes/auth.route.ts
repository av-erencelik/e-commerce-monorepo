import { Router } from 'express';
import { loginSchema, signupSchema } from '../schemas/user';
import { validate } from '@e-commerce-monorepo/middlewares';
import authController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/signup', validate(signupSchema), authController.signup);
authRouter.post('/login', validate(loginSchema), authController.login);

export default authRouter;
