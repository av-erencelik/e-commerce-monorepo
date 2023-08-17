import { Router } from 'express';
import { loginSchema, signupSchema } from '../schemas/user';
import { requireAuth, validate } from '@e-commerce-monorepo/middlewares';
import authController from '../controllers/auth.controller';
import { verifyTokenSchema } from '../schemas/token';

const authRouter = Router();

authRouter.post('/signup', validate(signupSchema), authController.signup);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/logout', authController.logout);
authRouter.post('/refresh-token', authController.refreshTokens);
authRouter.get('/current-user', requireAuth, authController.getCurrentUser);
authRouter.post(
  '/verify-email',
  validate(verifyTokenSchema),
  authController.verifyEmail
);

export default authRouter;
