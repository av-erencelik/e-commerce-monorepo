import { requireAdmin, validate } from '@e-commerce-monorepo/middlewares';
import { Router } from 'express';
import {
  addCategorySchema,
  addProductSchema,
  preSignedUrlSchema,
} from '../schemas/product';
import productController from '../controllers/product.controller';

const productRouter = Router();

productRouter.post(
  '/image',
  validate(preSignedUrlSchema),
  requireAdmin,
  productController.getPreSignedUrl
);

productRouter.post(
  '/create',
  validate(addProductSchema),
  requireAdmin,
  productController.addProduct
);

productRouter.post(
  '/create/category',
  validate(addCategorySchema),
  requireAdmin,
  productController.addCategory
);

export default productRouter;
