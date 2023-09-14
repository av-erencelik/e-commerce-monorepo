require('express-async-errors');
import { Router } from 'express';
import orderRouter from './order.route';
import cartRouter from './cart.route';

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
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
