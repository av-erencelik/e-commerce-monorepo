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
  GetFeaturedProductsQuery,
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
  res.status(httpStatus.OK).json({ images });
};

const addProduct = async (
  req: Request<ParamsDictionary, never, AddProduct>,
  res: Response
) => {
  const product = req.body;
  const addedProduct = await productService.addProduct(product);
  res.status(httpStatus.OK).json({ product: addedProduct });
};

const addSubCategory = async (
  req: Request<ParamsDictionary, never, AddCategory>,
  res: Response
) => {
  const category = req.body;
  const addedCategory = await productService.addSubCategory(category);
  res.status(httpStatus.OK).json({ category: addedCategory });
};

const getAllProducts = async (
  req: Request<ParamsDictionary, unknown, unknown, Page>,
  res: Response
) => {
  const { page, subcategory_id, sort_by, order, category_id } = req.query;
  logger.info(
    `Get all products with page: ${page}, subcategory: ${subcategory_id} and sort_by: ${sort_by}`
  );
  const { products, totalCount } = await productService.getAllProducts(
    page,
    subcategory_id,
    sort_by,
    order,
    category_id
  );
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
  const { sale_id } = req.query;
  await productService.deleteSale(productId, parseInt(sale_id));
  res.status(httpStatus.NO_CONTENT).json({ message: 'Sale deleted', sale_id });
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
  res.status(httpStatus.OK).json(product);
};

const deleteSubCategory = async (
  req: Request<ParamsDictionary & DeleteCategoryParams>,
  res: Response
) => {
  const { subCategoryId } = req.params;
  await productService.deleteSubCategory(subCategoryId);
  res
    .status(httpStatus.NO_CONTENT)
    .json({ message: 'Category deleted', subCategory: subCategoryId });
};

const updateSubCategory = async (
  req: Request<
    ParamsDictionary & UpdateCategoryParams,
    unknown,
    UpdateCategory
  >,
  res: Response
) => {
  const { subCategoryId } = req.params;
  const category = req.body;
  await productService.updateSubCategory(subCategoryId, category);
  res
    .status(httpStatus.NO_CONTENT)
    .json({ message: 'Category updated', subCategory: subCategoryId });
};

const getCategories = async (req: Request, res: Response) => {
  const categories = await productService.getCategories();
  res.status(httpStatus.OK).json({ categories });
};

const getSubCategories = async (req: Request, res: Response) => {
  const subCategories = await productService.getSubCategories();
  res.status(httpStatus.OK).json({ subCategories });
};

const getSubcategory = async (
  req: Request<
    ParamsDictionary & UpdateCategoryParams,
    unknown,
    UpdateCategory
  >,
  res: Response
) => {
  const { subCategoryId } = req.params;
  const subCategory = await productService.getSubcategory(subCategoryId);
  res.status(httpStatus.OK).json({ subcategory: subCategory });
};

const getSales = async (req: Request, res: Response) => {
  const sales = await productService.getSales();
  res.status(httpStatus.OK).json({ sales });
};

const getAllProductsIds = async (req: Request, res: Response) => {
  const products = await productService.getAllProductsIds();
  res.status(httpStatus.OK).json({ products });
};

const getFeaturedProducts = async (
  req: Request<ParamsDictionary, unknown, unknown, GetFeaturedProductsQuery>,
  res: Response
) => {
  const { newest, most_sold } = req.query;
  if (newest === 'true') {
    const products = await productService.getNewestProducts();
    res
      .status(httpStatus.OK)
      .json({ products, success: true, message: 'Newest products' });
  } else if (most_sold === 'true') {
    const products = await productService.getMostSoldProducts();
    res
      .status(httpStatus.OK)
      .json({ products, success: true, message: 'Most sold products' });
  } else {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, message: 'Invalid query parameters' });
  }
};

export default Object.freeze({
  getPreSignedUrl,
  addProduct,
  addSubCategory,
  getAllProducts,
  updateProduct,
  addSale,
  deleteSale,
  deleteProduct,
  deleteImage,
  setFeaturedImage,
  getProduct,
  deleteSubCategory,
  updateSubCategory,
  addImage,
  getCategories,
  getSubCategories,
  getSubcategory,
  getSales,
  getAllProductsIds,
  getFeaturedProducts,
});
