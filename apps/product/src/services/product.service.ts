import { ApiError } from '@e-commerce-monorepo/errors';
import { AddProduct, PreSignedUrlImage } from '../interfaces/product';
import { checkImageExists, createPresignedUrl } from '../lib/s3';
import httpStatus from 'http-status';
import productRepository from '../repository/product.repository';

const getPreSignedUrl = async (images: PreSignedUrlImage[]) => {
  const urls: Array<{ url: string; key: string }> = [];
  for (const image of images) {
    const url = await createPresignedUrl(image.type, image.name);
    urls.push(url);
  }
  return urls;
};

const addProduct = async (product: AddProduct) => {
  const { images } = product;
  let featuredImageNumber = 0;
  for (const image of images) {
    // check image featured
    if (image.isFeatured) {
      featuredImageNumber++;
    }
    // check if image exists
    if (!(await checkImageExists(image.key))) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Some images are not uploaded'
      );
    }
  }
  // check if featured image is more than one
  if (featuredImageNumber > 1) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Featured image must be only one'
    );
  }
  // add product to db
  const addedProduct = await productRepository.addProduct(product);
  return addedProduct;
};

export default Object.freeze({
  getPreSignedUrl,
  addProduct,
});
