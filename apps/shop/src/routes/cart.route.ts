import { validate } from '@e-commerce-monorepo/middlewares';
import { Router } from 'express';
import {
  addCartSchema,
  removeFromCartSchema,
  updateCartSchema,
} from '../schemas/cart';
import cartController from '../controllers/cart.controller';

const cartRouter = Router();

cartRouter.patch('/:id', validate(updateCartSchema), cartController.updateCart);

cartRouter.post('/', validate(addCartSchema), cartController.addToCart);

cartRouter.delete(
  '/',
  validate(removeFromCartSchema),
  cartController.removeFromCart
);

cartRouter.get('/', cartController.getCart);

export default cartRouter;
