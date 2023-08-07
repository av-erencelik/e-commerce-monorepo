require('express-async-errors');
import { Router } from 'express';
import authRouter from './auth.route';

const router = Router();

const routes = [
  {
    path: '/auth',
    router: authRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
