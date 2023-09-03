require('express-async-errors');
import { Router } from 'express';
import productRouter from './product.route';

const router = Router();

const routes = [
  {
    path: '/product',
    router: productRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
