import { AddCategory, AddProduct, PreSignedUrl } from '../interfaces/product';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import productService from '../services/product.service';

const getPreSignedUrl = async (
  req: Request<ParamsDictionary, never, PreSignedUrl>,
  res: Response
) => {
  const { images: imageData } = req.body;
  const images = await productService.getPreSignedUrl(imageData);
  res.status(200).json(images);
};

const addProduct = async (
  req: Request<ParamsDictionary, never, AddProduct>,
  res: Response
) => {
  const product = req.body;
  const addedProduct = await productService.addProduct(product);
  res.status(200).json({ product: addedProduct });
};

const addCategory = async (
  req: Request<ParamsDictionary, never, AddCategory>,
  res: Response
) => {
  const category = req.body;
  const addedCategory = await productService.addCategory(category);
  res.status(200).json({ category: addedCategory });
};

export default Object.freeze({
  getPreSignedUrl,
  addProduct,
  addCategory,
});
