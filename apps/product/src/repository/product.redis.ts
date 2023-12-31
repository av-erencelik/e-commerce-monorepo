import { redis } from '../database/redis';
import { Product } from '../interfaces/product';

const setProductsCache = async (
  products: Product[],
  page = 1,
  subcategory_id = 0,
  sort_by = 'id',
  order = 'desc',
  category_id = 0
) => {
  await redis.set(
    `products/${page}/${category_id}/${subcategory_id}/${sort_by}/${order}`,
    JSON.stringify(products),
    'EX',
    60
  ); // 1 minute
};

const setNewestProductsCache = async (products: Product[]) => {
  await redis.set(`products/newest`, JSON.stringify(products), 'EX', 60); // 1 minute
};

const setMostSoldProductsCache = async (products: Product[]) => {
  await redis.set(`products/most-sold`, JSON.stringify(products), 'EX', 60); // 1 minute
};

const setProductDetailsCache = async (product: Product) => {
  await redis.set(`product/${product.id}`, JSON.stringify(product), 'EX', 60); // 1 minute
};

const setTotalProductCountCache = async (
  count: number,
  category_id?: number,
  subcategory_id?: number
) => {
  await redis.set(
    `totalProductCount/${category_id}/${subcategory_id}`,
    count,
    'EX',
    60 * 60
  ); // 1 hour
};

const setCategoriesCache = async (
  categories: Array<{ id: number; name: string; description: string }>
) => {
  await redis.set(`categories`, JSON.stringify(categories), 'EX', 60 * 60 * 24); // 1 day
};

const setSubCategoriesCache = async (
  subCategories: Array<{
    id: number;
    name: string;
    description: string;
    categoryId: number;
  }>
) => {
  await redis.set(
    `subCategories`,
    JSON.stringify(subCategories),
    'EX',
    60 * 60
  ); // 1 hour
};

const getCategoriesCache = async function (): Promise<Array<{
  id: number;
  name: string;
  description: string;
}> | null> {
  const categories = await redis.get(`categories`);
  return categories ? JSON.parse(categories) : null;
};

const getSubCategoriesCache = async function (): Promise<Array<{
  id: number;
  name: string;
  description: string;
  categoryId: number;
}> | null> {
  const subCategories = await redis.get(`subCategories`);
  return subCategories ? JSON.parse(subCategories) : null;
};

const getProductsCache = async function (
  page = 1,
  subcategory_id = 0,
  sort_by = 'id',
  order = 'desc',
  category_id = 0
): Promise<Product[] | null> {
  const products = await redis.get(
    `products/${page}/${category_id}/${subcategory_id}/${sort_by}/${order}`
  );
  return products ? JSON.parse(products) : null;
};

const getNewestProductsCache = async function (): Promise<Product[] | null> {
  const products = await redis.get(`products/newest`);
  return products ? JSON.parse(products) : null;
};

const getMostSoldProductsCache = async function (): Promise<Product[] | null> {
  const products = await redis.get(`products/most-sold`);
  return products ? JSON.parse(products) : null;
};

const getProductDetailsCache = async function (
  productId: number
): Promise<Product | null> {
  const product = await redis.get(`product/${productId}`);
  return product ? JSON.parse(product) : null;
};

const getTotalProductCountCache = async function (
  category_id?: number,
  subcategory_id?: number
): Promise<number | null> {
  const count = await redis.get(
    `totalProductCount/${category_id}/${subcategory_id}`
  );
  return count ? parseInt(count) : null;
};

const invalidateCategoriesCache = async () => {
  await redis.del(`categories`);
};

const invalidateSubCategoriesCache = async () => {
  await redis.del(`subCategories`);
};

const invalidateProductsCache = async () => {
  const pattern = 'products/*';
  let cursor = '0';

  do {
    const result = await redis.scan(cursor, 'MATCH', pattern);
    cursor = result[0];
    const keys = result[1];
    if (keys.length) {
      await redis.del(...keys);
    }
  } while (cursor !== '0');
};

const invalidateProductDetailsCache = async (productId: number) => {
  await redis.del(`product/${productId}`);
};

const invalidateTotalProductCountCache = async () => {
  const pattern = 'totalProductCount/*';
  let cursor = '0';
  do {
    const result = await redis.scan(cursor, 'MATCH', pattern);
    cursor = result[0];
    const keys = result[1];
    if (keys.length) {
      await redis.del(...keys);
    }
  } while (cursor !== '0');
};

export default Object.freeze({
  setProductsCache,
  getProductsCache,
  invalidateProductsCache,
  getTotalProductCountCache,
  setTotalProductCountCache,
  invalidateTotalProductCountCache,
  getProductDetailsCache,
  setProductDetailsCache,
  invalidateProductDetailsCache,
  getCategoriesCache,
  setCategoriesCache,
  invalidateCategoriesCache,
  getSubCategoriesCache,
  setSubCategoriesCache,
  invalidateSubCategoriesCache,
  setNewestProductsCache,
  getNewestProductsCache,
  setMostSoldProductsCache,
  getMostSoldProductsCache,
});
