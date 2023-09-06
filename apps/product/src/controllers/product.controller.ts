import {
  AddCategory,
  AddProduct,
  Sale,
  AddSaleParams,
  Page,
  PreSignedUrl,
  UpdateProduct,
  UpdateProductParams,
  SaleId,
  DeleteSaleParams,
  DeleteImageParams,
  GetProductParams,
  DeleteCategoryParams,
  UpdateCategoryParams,
  UpdateCategory,
  AddImageParams,
  AddImage,
} from '../interfaces/product';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import productService from '../services/product.service';
import { logger } from '@e-commerce-monorepo/configs';
import httpStatus from 'http-status';

const getPreSignedUrl = async (
  req: Request<ParamsDictionary, never, PreSignedUrl>,
  res: Response
) => {
  const { images: imageData } = req.body;
  const images = await productService.getPreSignedUrl(imageData);
  res.status(httpStatus.OK).json(images);
};

const addProduct = async (
  req: Request<ParamsDictionary, never, AddProduct>,
  res: Response
) => {
  const product = req.body;
  const addedProduct = await productService.addProduct(product);
  res.status(httpStatus.OK).json({ product: addedProduct });
};

const addCategory = async (
  req: Request<ParamsDictionary, never, AddCategory>,
  res: Response
) => {
  const category = req.body;
  const addedCategory = await productService.addCategory(category);
  res.status(httpStatus.OK).json({ category: addedCategory });
};

const getAllProducts = async (
  req: Request<ParamsDictionary, unknown, unknown, Page>,
  res: Response
) => {
  const { page } = req.query;
  logger.info(`Get all products with page: ${page}`);
  const { products, totalCount } = await productService.getAllProducts(page);
  res.status(httpStatus.OK).json({ products, totalCount });
};

const updateProduct = async (
  req: Request<ParamsDictionary & UpdateProductParams, unknown, UpdateProduct>,
  res: Response
) => {
  const { productId } = req.params;
  const product = req.body;
  await productService.updateProduct(productId, product);
  res
    .status(httpStatus.CREATED)
    .json({ message: 'Product updated', product: productId });
};

const addSale = async (
  req: Request<ParamsDictionary & AddSaleParams, unknown, Sale>,
  res: Response
) => {
  const { productId } = req.params;
  const sale = req.body;
  await productService.addSale(productId, sale);
  res
    .status(httpStatus.CREATED)
    .json({ message: 'Sale added', product: productId });
};

const deleteSale = async (
  req: Request<ParamsDictionary & DeleteSaleParams, unknown, unknown, SaleId>,
  res: Response
) => {
  const { productId } = req.params;
  const { saleId } = req.query;
  await productService.deleteSale(productId, parseInt(saleId));
  res.status(httpStatus.NO_CONTENT).json({ message: 'Sale deleted', saleId });
};

const deleteProduct = async (
  req: Request<ParamsDictionary & DeleteSaleParams>,
  res: Response
) => {
  const { productId } = req.params;
  await productService.deleteProduct(productId);
  res
    .status(httpStatus.NO_CONTENT)
    .json({ message: 'Product deleted', productId });
};

const deleteImage = async (
  req: Request<ParamsDictionary & DeleteImageParams>,
  res: Response
) => {
  const { key } = req.params;
  await productService.deleteImage(key);
  res.status(httpStatus.NO_CONTENT).json({ message: 'Image deleted', key });
};

const addImage = async (
  req: Request<ParamsDictionary & AddImageParams, unknown, AddImage>,
  res: Response
) => {
  const { productId } = req.params;
  const { key, isFeatured } = req.body;
  await productService.addImage(productId, key, isFeatured);
  res
    .status(httpStatus.CREATED)
    .json({ message: 'Image added', product: productId });
};

const setFeaturedImage = async (
  req: Request<ParamsDictionary & DeleteImageParams>,
  res: Response
) => {
  const { key } = req.params;
  await productService.setFeaturedImage(key);
  res.status(httpStatus.NO_CONTENT).json({ message: 'Image updated', key });
};

const getProduct = async (
  req: Request<ParamsDictionary & GetProductParams>,
  res: Response
) => {
  const { productId } = req.params;
  const product = await productService.getProduct(productId);
  res.status(httpStatus.OK).json({ product });
};

const deleteCategory = async (
  req: Request<ParamsDictionary & DeleteCategoryParams>,
  res: Response
) => {
  const { categoryId } = req.params;
  await productService.deleteCategory(categoryId);
  res
    .status(httpStatus.NO_CONTENT)
    .json({ message: 'Category deleted', categoryId });
};

const updateCategory = async (
  req: Request<
    ParamsDictionary & UpdateCategoryParams,
    unknown,
    UpdateCategory
  >,
  res: Response
) => {
  const { categoryId } = req.params;
  const category = req.body;
  await productService.updateCategory(categoryId, category);
  res
    .status(httpStatus.NO_CONTENT)
    .json({ message: 'Category updated', category: categoryId });
};

export default Object.freeze({
  getPreSignedUrl,
  addProduct,
  addCategory,
  getAllProducts,
  updateProduct,
  addSale,
  deleteSale,
  deleteProduct,
  deleteImage,
  setFeaturedImage,
  getProduct,
  deleteCategory,
  updateCategory,
  addImage,
});
