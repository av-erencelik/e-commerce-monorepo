import { Router } from 'express';
import { checkCartSchema, getOrderSchema } from '../schemas/cart';
import { requireAuth, validate } from '@e-commerce-monorepo/middlewares';
import orderController from '../controllers/order.controller';

const orderRouter = Router();

orderRouter.get(
  '/:id',
  validate(getOrderSchema),
  requireAuth,
  orderController.getOrder
);

orderRouter.post(
  '/',
  validate(checkCartSchema),
  requireAuth,
  orderController.createOrder
);

orderRouter.get('/', requireAuth, orderController.getOrders);

export default orderRouter;
