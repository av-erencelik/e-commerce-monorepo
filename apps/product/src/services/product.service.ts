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
  createImageUrl,
  createPresignedUrl,
} from '../lib/s3';
import httpStatus from 'http-status';
import productRepository from '../repository/product.repository';
import productRedis from '../repository/product.redis';
import {
  ProductCreated,
  ProductDeleted,
  ProductPriceDeleted,
  ProductPriceUpdated,
  ProductStockUpdated,
  ProductUpdated,
} from '@e-commerce-monorepo/event-bus';

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
  // check if sub category exists
  const subCategoryExists = await productRepository.checkSubCategoryExists(
    product.subCategoryId
  );
  if (!subCategoryExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sub category does not exist');
  }
  // add product to db
  const addedProduct = await productRepository.addProduct(product);
  await productRedis.invalidateProductsCache();
  await productRedis.invalidateTotalProductCountCache();
  const ProductCreatedEvent = new ProductCreated();
  await ProductCreatedEvent.publish({
    endDate: new Date('9999-12-31').toISOString(),
    id: addedProduct.id,
    image: product.images.filter((image) => image.isFeatured)[0].key,
    name: addedProduct.name,
    price: product.price,
    startDate: new Date().toISOString(),
    stock: addedProduct.stock,
    version: addedProduct.version,
  });
  return addedProduct;
};

const addSubCategory = async (category: AddCategory) => {
  const categoryExists =
    await productRepository.checkSubCategoryExistWithSameName(category.name);
  if (categoryExists.exists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Category with same name already exists'
    );
  }
  const addedCategory = await productRepository.addSubCategory(category);
  await productRedis.invalidateSubCategoriesCache();
  await productRedis.invalidateCategoriesCache();
  await productRedis.invalidateProductsCache();
  return addedCategory;
};

const getAllProducts = async (
  page: number | undefined,
  subcategory_id: number | undefined
) => {
  let products: Product[];
  let totalCount: number;
  const cachedProducts = await productRedis.getProductsCache(
    page,
    subcategory_id
  );
  if (cachedProducts) {
    products = cachedProducts;
  } else {
    products = (await productRepository.getAllProducts(
      page,
      subcategory_id
    )) as Product[];
    products = products.map((product) => {
      const { images } = product;
      const imagesWithSignedUrl = images.map((image) => {
        const url = createImageUrl(image.key);
        return {
          ...image,
          url,
        };
      });
      return {
        ...product,
        images: imagesWithSignedUrl,
      };
    });
    await productRedis.setProductsCache(products, page, subcategory_id);
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
    const images = product.images.map((image) => {
      const url = createImageUrl(image.key);
      return {
        ...image,
        url,
      };
    });
    product = {
      ...product,
      images,
    };
    await productRedis.setProductDetailsCache(product);
  }
  return product;
};

const restockOnEvery24Hours = async () => {
  const products = await productRepository.restockAllProducts();
  await productRedis.invalidateProductsCache();
  const productStockUpdatedEvent = new ProductStockUpdated();
  productStockUpdatedEvent.publish({
    products,
  });
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
  // check if sub category exists
  const subCategoryExists = await productRepository.checkSubCategoryExists(
    product.subCategoryId
  );
  if (!subCategoryExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sub category does not exist');
  }
  // update product
  const result = await productRepository.updateProduct(
    productId,
    updatedProduct,
    product
  );
  if (result) {
    const ProductUpdatedEvent = new ProductUpdated();
    await ProductUpdatedEvent.publish({
      endDate: new Date('9999-12-31').toISOString(),
      id: productId,
      image: product.images.filter((image) => image.isFeatured)[0].key,
      name: updatedProduct.name || product.name,
      price: updatedProduct.price || product.price[0].price,
      startDate: new Date().toISOString(),
      stock: updatedProduct.stock || product.stock,
      version: product.version + 1,
      priceId: product.price[0].id,
    });
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
  const productPriceUpdatedEvent = new ProductPriceUpdated();
  await productPriceUpdatedEvent.publish({
    productId: productId,
    price: sale.discountPrice,
    originalPrice: sale.originalPrice,
    startDate: new Date(sale.startDate).toISOString(),
    endDate: new Date(sale.endDate).toISOString(),
  });
  await productRedis.invalidateProductsCache();
  await productRedis.invalidateProductDetailsCache(productId);
};

const deleteSale = async (productId: number, saleId: number) => {
  const product = await productRepository.getProduct(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const sale = await productRepository.getSale(saleId);
  if (!sale) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sale not found');
  }
  if (sale.endDate < new Date()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot delete sale that has already ended'
    );
  }
  await productRepository.deleteSale(productId, saleId);
  const productPriceDeletedEvent = new ProductPriceDeleted();
  await productPriceDeletedEvent.publish({
    id: saleId,
  });
  await productRedis.invalidateProductsCache();
  await productRedis.invalidateProductDetailsCache(productId);
};

const deleteProduct = async (productId: number) => {
  const product = await productRepository.getProduct(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await productRepository.deleteProduct(productId);
  const productDeletedEvent = new ProductDeleted();
  await productDeletedEvent.publish({
    id: productId,
  });
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

const deleteSubCategory = async (categoryId: number) => {
  const categoryExists = await productRepository.checkSubCategoryExists(
    categoryId
  );
  if (!categoryExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await productRepository.deleteSubCategory(categoryId);
  await productRedis.invalidateSubCategoriesCache();
  await productRedis.invalidateCategoriesCache();
  await productRedis.invalidateProductsCache();
};

const updateSubCategory = async (
  categoryId: number,
  updatedCategory: UpdateCategory
) => {
  const subcategoryExists = await productRepository.checkSubCategoryExists(
    categoryId
  );
  if (!subcategoryExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  const categoryExists = await productRepository.checkCategoryExists(
    updatedCategory.categoryId
  );
  if (!categoryExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category does not exist');
  }
  const categoryWithSameName =
    await productRepository.checkSubCategoryExistWithSameName(
      updatedCategory.name
    );
  if (categoryWithSameName.exists && categoryWithSameName.id !== categoryId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Category with same name already exists'
    );
  }
  await productRepository.updateSubCategory(categoryId, updatedCategory);
  await productRedis.invalidateSubCategoriesCache();
  await productRedis.invalidateCategoriesCache();
  await productRedis.invalidateProductsCache();
};

const getCategories = async () => {
  const cachedCategories = await productRedis.getCategoriesCache();
  if (cachedCategories) {
    return cachedCategories;
  }
  const categories = await productRepository.getCategories();
  await productRedis.setCategoriesCache(categories);
  return categories;
};

const getSubCategories = async () => {
  const cachedSubCategories = await productRedis.getSubCategoriesCache();
  if (cachedSubCategories) {
    return cachedSubCategories;
  }
  const subCategories = await productRepository.getSubCategories();
  await productRedis.setSubCategoriesCache(subCategories);
  return subCategories;
};

const getSubcategory = async (categoryId: number) => {
  const categoryExists = await productRepository.checkSubCategoryExists(
    categoryId
  );
  if (!categoryExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  const subCategory = await productRepository.getSubcategory(categoryId);
  return subCategory;
};

const getSales = async () => {
  const sales = await productRepository.getSales();
  return sales;
};

const getAllProductsIds = async () => {
  const products = await productRepository.getAllProductsIds();
  return products;
};

const getNewestProducts = async () => {
  const products = await productRepository.getNewestProducts();
  return products;
};

const getMostSoldProducts = async () => {
  const products = await productRepository.getMostSoldProducts();
  return products;
};

export default Object.freeze({
  getPreSignedUrl,
  addProduct,
  addSubCategory,
  getAllProducts,
  restockOnEvery24Hours,
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
  getNewestProducts,
  getMostSoldProducts,
});
