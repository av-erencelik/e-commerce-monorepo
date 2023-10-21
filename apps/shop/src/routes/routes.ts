require('express-async-errors');
import { Router } from 'express';
import orderRouter from './order.route';
import cartRouter from './cart.route';
import webhookRouter from './webhook.route';

const router = Router();

const routes = [
  {
    path: '/shop/order',
    router: orderRouter,
  },
  {
    path: '/shop/cart',
    router: cartRouter,
  },
  {
    path: '/shop/webhook',
    router: webhookRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
