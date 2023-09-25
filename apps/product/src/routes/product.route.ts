import { requireAdmin, validate } from '@e-commerce-monorepo/middlewares';
import { Router } from 'express';
import {
  addSubCategorySchema,
  addImageSchema,
  addProductSchema,
  addSaleSchema,
  subCategorySchema,
  deleteImageSchema,
  deleteProductSchema,
  deleteSaleSchema,
  getAllProductsSchema,
  getProductSchema,
  preSignedUrlSchema,
  updateSubCategorySchema,
  updateProductSchema,
  getFeaturedProductsSchema,
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

productRouter.get('/categories', productController.getCategories);

productRouter.get('/category', productController.getSubCategories);

productRouter.get(
  '/category/:subCategoryId',
  validate(subCategorySchema),
  productController.getSubcategory
);

productRouter.post(
  '/category',
  validate(addSubCategorySchema),
  requireAdmin,
  productController.addSubCategory
);

productRouter.delete(
  '/category/:subCategoryId',
  validate(subCategorySchema),
  requireAdmin,
  productController.deleteSubCategory
);

productRouter.patch(
  '/category/:subCategoryId',
  validate(updateSubCategorySchema),
  requireAdmin,
  productController.updateSubCategory
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

productRouter.get('/sale', requireAdmin, productController.getSales);

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

// get products

productRouter.get('/ids', requireAdmin, productController.getAllProductsIds);

productRouter.get(
  '/:productId',
  validate(getProductSchema),
  productController.getProduct
);

productRouter.get(
  '/featured',
  validate(getFeaturedProductsSchema),
  productController.getFeaturedProducts
);

productRouter.get(
  '/',
  validate(getAllProductsSchema),
  productController.getAllProducts
);

export default productRouter;
