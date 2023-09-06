import { ApiError } from '@e-commerce-monorepo/errors';
import {
  AddCategory,
  AddProduct,
  PreSignedUrlImage,
  Product,
  Sale,
  UpdateCategory,
  UpdateProduct,
} from '../interfaces/product';
import {
  checkImageExists,
  createPresignedUrl,
  deleteImageFromS3,
} from '../lib/s3';
import httpStatus from 'http-status';
import productRepository from '../repository/product.repository';
import productRedis from '../repository/product.redis';

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
  // check if category exists
  const categoryExists = await productRepository.checkCategoryExists(
    product.categoryId
  );
  if (!categoryExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category does not exist');
  }
  // add product to db
  const addedProduct = await productRepository.addProduct(product);
  await productRedis.invalidateProductsCache();
  await productRedis.invalidateTotalProductCountCache();
  return addedProduct;
};

const addCategory = async (category: AddCategory) => {
  const categoryExists = await productRepository.checkCategoryExistWithSameName(
    category.name
  );
  if (categoryExists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Category with same name already exists'
    );
  }
  const addedCategory = await productRepository.addCategory(category);
  return addedCategory;
};

const getAllProducts = async (page: number | undefined) => {
  let products: Product[];
  let totalCount: number;
  const cachedProducts = await productRedis.getProductsCache(page);
  if (cachedProducts) {
    products = cachedProducts;
  } else {
    products = (await productRepository.getAllProducts(page)) as Product[];
    await productRedis.setProductsCache(products, page);
  }

  const cachedTotalCount = await productRedis.getTotalProductCountCache();
  if (cachedTotalCount) {
    totalCount = cachedTotalCount;
  } else {
    const { count } = await productRepository.getTotalProduct();
    totalCount = count;
    await productRedis.setTotalProductCountCache(totalCount);
  }

  return {
    products,
    totalCount,
  };
};

const getProduct = async (productId: number) => {
  let product: Product | null;
  const cachedProduct = await productRedis.getProductDetailsCache(productId);
  if (cachedProduct) {
    product = cachedProduct;
  } else {
    product = await productRepository.getProduct(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    await productRedis.setProductDetailsCache(product);
  }
  return product;
};

const restockOnEvery24Hours = async () => {
  await productRepository.restockAllProducts();
};

const updateProduct = async (
  productId: number,
  updatedProduct: UpdateProduct
) => {
  const product = await productRepository.getProduct(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
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
  // check if category exists
  const categoryExists = await productRepository.checkCategoryExists(
    product.categoryId
  );
  if (!categoryExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category does not exist');
  }
  // update product
  const result = await productRepository.updateProduct(
    productId,
    updatedProduct,
    product
  );
  if (result) {
    await productRedis.invalidateProductsCache();
    await productRedis.invalidateProductDetailsCache(productId);
  } else {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update product'
    );
  }
};

const addSale = async (productId: number, sale: Sale) => {
  const product = await productRepository.getProduct(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  // check start date and end date are older than current time and start date is before end date
  if (sale.startDate > sale.endDate) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Start date must be before end date'
    );
  }
  // check if start date is today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (sale.startDate < today.getMilliseconds()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Start date must be today or later'
    );
  }

  await productRepository.addSale(productId, sale);
  await productRedis.invalidateProductsCache();
  await productRedis.invalidateProductDetailsCache(productId);
};

const deleteSale = async (productId: number, saleId: number) => {
  const product = await productRepository.getProduct(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await productRepository.deleteSale(productId, saleId);
  await productRedis.invalidateProductsCache();
  await productRedis.invalidateProductDetailsCache(productId);
};

const deleteProduct = async (productId: number) => {
  const product = await productRepository.getProduct(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await productRepository.deleteProduct(productId);
  await productRedis.invalidateProductsCache();
  await productRedis.invalidateTotalProductCountCache();
  await productRedis.invalidateProductDetailsCache(productId);
};

const deleteImage = async (key: string) => {
  const image = await productRepository.getImage(key);
  if (!image) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
  }
  if (image.isFeatured) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot delete featured image, please set another image as featured first'
    );
  }
  const response = await deleteImageFromS3(key);
  if (!response) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete image'
    );
  }
  await productRepository.deleteImage(key);
  await productRedis.invalidateProductsCache();
  await productRedis.invalidateProductDetailsCache(image.productId);
};

const addImage = async (
  productId: number,
  key: string,
  isFeatured: boolean
) => {
  const product = await productRepository.getProduct(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  if (!(await checkImageExists(key))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Image not uploaded');
  }
  await productRepository.addImage(productId, key);
  if (isFeatured) {
    await productRepository.setFeaturedImage(key);
  }
  await productRedis.invalidateProductsCache();
  await productRedis.invalidateProductDetailsCache(productId);
};

const setFeaturedImage = async (key: string) => {
  const image = await productRepository.getImage(key);
  if (!image) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
  }
  await productRepository.setFeaturedImage(key);
  await productRedis.invalidateProductsCache();
  await productRedis.invalidateProductDetailsCache(image.productId);
};

const deleteCategory = async (categoryId: number) => {
  const categoryExists = await productRepository.checkCategoryExists(
    categoryId
  );
  if (!categoryExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await productRepository.deleteCategory(categoryId);
};

const updateCategory = async (
  categoryId: number,
  updatedCategory: UpdateCategory
) => {
  const categoryExists = await productRepository.checkCategoryExists(
    categoryId
  );
  if (!categoryExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await productRepository.updateCategory(categoryId, updatedCategory);
};

export default Object.freeze({
  getPreSignedUrl,
  addProduct,
  addCategory,
  getAllProducts,
  restockOnEvery24Hours,
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
