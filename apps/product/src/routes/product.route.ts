import { requireAdmin, validate } from '@e-commerce-monorepo/middlewares';
import { Router } from 'express';
import { preSignedUrlSchema } from '../schemas/product';
import productController from '../controllers/product.controller';

const productRouter = Router();

productRouter.post(
  '/image',
  validate(preSignedUrlSchema),
  requireAdmin,
  productController.getPreSignedUrl
);

export default productRouter;
