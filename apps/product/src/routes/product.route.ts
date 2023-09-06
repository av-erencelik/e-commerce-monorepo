import { requireAdmin, validate } from '@e-commerce-monorepo/middlewares';
import { Router } from 'express';
import {
  addCategorySchema,
  addImageSchema,
  addProductSchema,
  addSaleSchema,
  categorySchema,
  deleteImageSchema,
  deleteProductSchema,
  deleteSaleSchema,
  getAllProductsSchema,
  getProductSchema,
  preSignedUrlSchema,
  updateCategorySchema,
  updateProductSchema,
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
  '/category',
  validate(addCategorySchema),
  requireAdmin,
  productController.addCategory
);

productRouter.delete(
  '/category/:categoryId',
  validate(categorySchema),
  requireAdmin,
  productController.deleteCategory
);

productRouter.patch(
  '/category/:categoryId',
  validate(updateCategorySchema),
  requireAdmin,
  productController.updateCategory
);

productRouter.patch(
  '/update/:productId',
  validate(updateProductSchema),
  requireAdmin,
  productController.updateProduct
);

productRouter.post(
  '/sale/:productId',
  validate(addSaleSchema),
  requireAdmin,
  productController.addSale
);

productRouter.delete(
  '/sale/:productId',
  validate(deleteSaleSchema),
  requireAdmin,
  productController.deleteSale
);

productRouter.delete(
  '/:productId',
  validate(deleteProductSchema),
  requireAdmin,
  productController.deleteProduct
);

productRouter.delete(
  '/image/:key',
  validate(deleteImageSchema),
  requireAdmin,
  productController.deleteImage
);

productRouter.patch(
  '/image/:key',
  validate(deleteImageSchema),
  requireAdmin,
  productController.setFeaturedImage
);

productRouter.post(
  '/image/:productId',
  validate(addImageSchema),
  requireAdmin,
  productController.addImage
);

productRouter.get(
  '/',
  validate(getAllProductsSchema),
  productController.getAllProducts
);

productRouter.get(
  '/:productId',
  validate(getProductSchema),
  productController.getProduct
);

export default productRouter;
