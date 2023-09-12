require('express-async-errors');
import { Router } from 'express';
import orderRouter from './order.route';

const router = Router();

const routes = [
  {
    path: '/shop/order',
    router: orderRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
