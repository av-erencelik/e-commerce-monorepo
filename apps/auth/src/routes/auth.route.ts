import { Router } from 'express';
import { userSchema } from '../schemas/user';
import { validate } from '@e-commerce-monorepo/middlewares';
import authController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/login', validate(userSchema), authController.login);

export default authRouter;
