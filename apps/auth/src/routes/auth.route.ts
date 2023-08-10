import { Router } from 'express';
import { signupSchema } from '../schemas/user';
import { validate } from '@e-commerce-monorepo/middlewares';
import authController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/signup', validate(signupSchema), authController.signup);

export default authRouter;
