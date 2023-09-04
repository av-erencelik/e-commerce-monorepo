import { eq } from 'drizzle-orm';
import db from '../database/sql';
import { product, image, productPrice, category } from '../models/schema';
import { AddCategory, AddProduct } from '../interfaces/product';

const addProduct = async (newProduct: AddProduct) => {
  const { images } = newProduct;
  await db.insert(product).values({
    name: newProduct.name,
    description: newProduct.description,
    categoryId: newProduct.categoryId,
    stock: newProduct.stock,
    weight: newProduct.weight ? newProduct.weight : null,
    version: 0,
  });

  const addedProduct = await db
    .select()
    .from(product)
    .where(eq(product.name, newProduct.name));

  const editedImages = images.map((image) => ({
    ...image,
    productId: addedProduct[0].id,
  }));

  await db.insert(image).values(editedImages);

  await db.insert(productPrice).values({
    price: newProduct.price,
    originalPrice: newProduct.price,
    productId: addedProduct[0].id,
    startDate: new Date(),
    endDate: new Date('9999-12-31'),
    version: 0,
  });

  return addedProduct[0];
};

const addCategory = async (newCategory: AddCategory) => {
  await db.insert(category).values({
    name: newCategory.name,
    description: newCategory.description,
  });

  const addedCategory = await db
    .select()
    .from(product)
    .where(eq(product.name, category.name));

  return addedCategory[0];
};

const checkCategoryExists = async (categoryId: number) => {
  // check if category exists
  const response = await db
    .select()
    .from(category)
    .where(eq(category.id, categoryId));
  return response.length > 0;
};

export default Object.freeze({
  addProduct,
  addCategory,
  checkCategoryExists,
});
