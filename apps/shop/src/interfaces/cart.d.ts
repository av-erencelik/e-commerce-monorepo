import {
  addCartSchema,
  checkCartSchema,
  createOrderSchema,
  removeFromCartSchema,
  updateCartSchema,
} from './../schemas/cart';
import { z } from 'zod';

// cart related
type AddCart = z.infer<typeof addCartSchema>['query'];
type RemoveFromCart = z.infer<typeof removeFromCartSchema>['query'];
type UpdateCartParams = z.infer<typeof updateCartSchema>['params'];
type UpdateCartQuery = z.infer<typeof updateCartSchema>['query'];
type CheckCart = z.infer<typeof checkCartSchema>['query'];
type CreateOrder = z.infer<typeof createOrderSchema>['query'];

export {
  AddCart,
  RemoveFromCart,
  UpdateCartParams,
  UpdateCartQuery,
  CheckCart,
  CreateOrder,
};
