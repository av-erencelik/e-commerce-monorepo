import { Router } from 'express';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  updateUserSchema,
} from '../schemas/user';
import { requireAuth, validate } from '@e-commerce-monorepo/middlewares';
import authController from '../controllers/auth.controller';
import { verifyTokenSchema } from '../schemas/token';

const authRouter = Router();

authRouter.post('/signup', validate(signupSchema), authController.signup);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/logout', authController.logout);
authRouter.post('/refresh-token', authController.refreshTokens);
authRouter.get('/current-user', requireAuth, authController.getCurrentUser);
authRouter.get('/get-user', requireAuth, authController.getUser);
authRouter.put(
  '/update-user',
  validate(updateUserSchema),
  requireAuth,
  authController.updateUser
);
authRouter.post(
  '/verify-email',
  requireAuth,
  validate(verifyTokenSchema),
  authController.verifyEmail
);
authRouter.put(
  '/verify-email',
  requireAuth,
  authController.resendVerificationEmail
);
authRouter.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

authRouter.put(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

export default authRouter;
