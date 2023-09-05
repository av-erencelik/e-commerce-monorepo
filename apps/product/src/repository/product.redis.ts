import { redis } from '../database/redis';
import { Product } from '../interfaces/product';

const setProductsCache = async (products: Product[], page = 1) => {
  await redis.set(`products/${page}`, JSON.stringify(products), 'EX', 60 * 60); // 1 hour
};

const setProductDetailsCache = async (product: Product) => {
  await redis.set(
    `product/${product.id}`,
    JSON.stringify(product),
    'EX',
    60 * 60
  ); // 1 hour
};

const setTotalProductCountCache = async (count: number) => {
  await redis.set('totalProductCount', count, 'EX', 60 * 60); // 1 hour
};

const getProductsCache = async function (page = 1): Promise<Product[] | null> {
  const products = await redis.get(`products/${page}`);
  return products ? JSON.parse(products) : null;
};

const getProductDetailsCache = async function (
  productId: number
): Promise<Product | null> {
  const product = await redis.get(`product/${productId}`);
  return product ? JSON.parse(product) : null;
};

const getTotalProductCountCache = async function (): Promise<number | null> {
  const count = await redis.get('totalProductCount');
  return count ? parseInt(count) : null;
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
  await redis.del('totalProductCount');
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
});
