import { AccessTokenPayload } from '@e-commerce-monorepo/utils';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
