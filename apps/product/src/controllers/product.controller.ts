import { PreSignedUrl } from '../interfaces/product';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import productService from '../services/product.service';

const getPreSignedUrl = async (
  req: Request<ParamsDictionary, never, PreSignedUrl>,
  res: Response
) => {
  const { images } = req.body;
  const urls = await productService.getPreSignedUrl(images);
  res.status(200).json({ urls });
};

export default Object.freeze({
  getPreSignedUrl,
});
