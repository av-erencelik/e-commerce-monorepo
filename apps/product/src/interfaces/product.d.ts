import { z } from 'zod';
import {
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
import { InferModel } from 'drizzle-orm';
import {
  category,
  image,
  product,
  productPrice,
  subCategory,
} from '../models/schema';

type PreSignedUrl = z.infer<typeof preSignedUrlSchema>['body'];
type AddProduct = z.infer<typeof addProductSchema>['body'];
type Page = z.infer<typeof getAllProductsSchema>['query'];
type UpdateProduct = z.infer<typeof updateProductSchema>['body'];
type UpdateProductParams = z.infer<typeof updateProductSchema>['params'];
type Sale = z.infer<typeof addSaleSchema>['body'];
type AddSaleParams = z.infer<typeof addSaleSchema>['params'];
type DeleteSaleParams = z.infer<typeof deleteSaleSchema>['params'];
type SaleId = z.infer<typeof deleteSaleSchema>['query'];
type DeleteProductParams = z.infer<typeof deleteProductSchema>['params'];
type DeleteImageParams = z.infer<typeof deleteImageSchema>['params'];
type GetProductParams = z.infer<typeof getProductSchema>['params'];
type DeleteCategoryParams = z.infer<typeof subCategorySchema>['params'];
type UpdateCategoryParams = z.infer<typeof updateSubCategorySchema>['params'];
type UpdateCategory = z.infer<typeof updateSubCategorySchema>['body'];
type AddImageParams = z.infer<typeof addImageSchema>['params'];
type AddImage = z.infer<typeof addImageSchema>['body'];
type GetFeaturedProductsQuery = z.infer<
  typeof getFeaturedProductsSchema
>['query'];

type PreSignedUrlImage = PreSignedUrl['images'][number];

type AddCategory = InferModel<typeof subCategory, 'insert'>;
type IndividualProduct = InferModel<typeof product, 'select'>;
type Image = InferModel<typeof image, 'select'>;
type ProductPrice = InferModel<typeof productPrice, 'select'>;
type Category = InferModel<typeof category, 'select'>;
type SubCategory = InferModel<typeof subCategory, 'select'>;

type Product = IndividualProduct & {
  price: ProductPrice[];
  images: Image[];
  category: Category;
  subCategory: SubCategory;
};

export {
  PreSignedUrl,
  PreSignedUrlImage,
  AddProduct,
  AddCategory,
  Product,
  Page,
  UpdateProduct,
  UpdateProductParams,
  Sale,
  AddSaleParams,
  DeleteSaleParams,
  SaleId,
  DeleteProductParams,
  DeleteImageParams,
  GetProductParams,
  DeleteCategoryParams,
  UpdateCategoryParams,
  UpdateCategory,
  AddImageParams,
  AddImage,
  GetFeaturedProductsQuery,
};
