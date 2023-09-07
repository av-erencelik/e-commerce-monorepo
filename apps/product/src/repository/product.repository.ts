import { and, eq, sql } from 'drizzle-orm';
import db from '../database/sql';
import {
  product,
  image,
  productPrice,
  category,
  review,
} from '../models/schema';
import {
  AddCategory,
  AddProduct,
  Product,
  Sale,
  UpdateCategory,
  UpdateProduct,
} from '../interfaces/product';

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
    .from(category)
    .where(eq(category.name, newCategory.name));

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

const checkCategoryExistWithSameName = async (name: string) => {
  // check if category exists
  const response = await db
    .select()
    .from(category)
    .where(eq(category.name, name));
  return response.length > 0;
};

const getAllProducts = async (page = 1) => {
  const products = await db.query.product.findMany({
    columns: {
      categoryId: true,
      createdAt: true,
      description: true,
      id: true,
      name: true,
      weight: true,
      stock: true,
      dailySales: true,
    },
    limit: 12,
    offset: (page - 1) * 12,
    orderBy: (product, { desc }) => desc(product.createdAt),
    with: {
      images: {
        where: (image, { eq }) => eq(image.isFeatured, true),
      },
      price: {
        where: (price, { sql, and }) =>
          and(
            sql`${price.startDate} < ${new Date()}`,
            sql`${price.endDate} > ${new Date()}`
          ),
        orderBy: (price, { desc }) => desc(price.startDate),
        limit: 1,
      },
      category: true,
    },
  });
  return products.map((product) => {
    return {
      ...product,
      stock: product.stock - product.dailySales,
    };
  });
};

const getProduct = async (productId: number) => {
  const product = await db.query.product.findFirst({
    where: (product, { eq }) => eq(product.id, productId),
    with: {
      images: true,
      price: {
        where: (price, { sql, and }) =>
          and(
            sql`${price.startDate} < ${new Date()}`,
            sql`${price.endDate} > ${new Date()}`
          ),
        limit: 1,
      },
      category: true,
    },
  });
  if (!product) {
    return null;
  }
  return {
    ...product,
    stock: product.stock - product.dailySales,
  };
};

const getTotalProduct = async () => {
  const totalProduct = await db
    .select({ count: sql<number>`count(*)` })
    .from(product);
  return totalProduct[0];
};

const restockAllProducts = async () => {
  const allProducts = await db.select().from(product);
  for (const individualProduct of allProducts) {
    await db.update(product).set({
      stock: individualProduct.stock + individualProduct.dailySales,
      dailySales: 0,
    });
  }
};

const updateProduct = async (
  productId: number,
  updatedProduct: UpdateProduct,
  currentProduct: Product
) => {
  try {
    const { images } = updatedProduct;
    await db
      .update(product)
      .set({
        categoryId: updatedProduct.categoryId
          ? updatedProduct.categoryId
          : currentProduct.categoryId,
        name: updatedProduct.name ? updatedProduct.name : currentProduct.name,
        description: updatedProduct.description
          ? updatedProduct.description
          : currentProduct.description,
        stock: updatedProduct.stock
          ? updatedProduct.stock
          : currentProduct.stock,
        weight: updatedProduct.weight
          ? updatedProduct.weight
          : currentProduct.weight,
        version: currentProduct.version + 1,
      })
      .where(eq(product.id, productId));

    if (
      updatedProduct.price &&
      updatedProduct.price !== currentProduct.price[0].price
    ) {
      await db
        .update(productPrice)
        .set({
          endDate: new Date(),
        })
        .where(eq(productPrice.id, currentProduct.price[0].id));

      await db.insert(productPrice).values({
        originalPrice: updatedProduct.price,
        price: updatedProduct.price,
        productId: productId,
        startDate: new Date(),
        endDate: new Date('9999-12-31'),
      });
    }

    if (images.length > 0) {
      const editedImages = images.map((image) => ({
        ...image,
        productId: productId,
      }));

      await db.delete(image).where(eq(image.productId, productId));
      await db.insert(image).values(editedImages);
    }
    return true;
  } catch (err) {
    return false;
  }
};

const addSale = async (productId: number, sale: Sale) => {
  await db
    .update(productPrice)
    .set({
      endDate: new Date(sale.startDate),
    })
    .where(
      and(
        eq(productPrice.productId, productId),
        eq(productPrice.endDate, new Date('9999-12-31'))
      )
    );
  await db.insert(productPrice).values({
    originalPrice: sale.originalPrice,
    price: sale.discountPrice,
    productId: productId,
    startDate: new Date(sale.startDate),
    endDate: new Date(sale.endDate),
  });
  await db.insert(productPrice).values({
    price: sale.originalPrice,
    originalPrice: sale.originalPrice,
    productId: productId,
    startDate: new Date(sale.endDate),
    endDate: new Date('9999-12-31'),
  });
};

const deleteSale = async (productId: number, saleId: number) => {
  await db
    .update(productPrice)
    .set({
      endDate: new Date(),
    })
    .where(eq(productPrice.id, saleId));
  await db
    .update(productPrice)
    .set({
      startDate: new Date(),
    })
    .where(
      and(
        eq(productPrice.productId, productId),
        eq(productPrice.endDate, new Date('9999-12-31'))
      )
    );
};

const deleteProduct = async (productId: number) => {
  await db.delete(product).where(eq(product.id, productId));
  await db.delete(image).where(eq(image.productId, productId));
  await db.delete(productPrice).where(eq(productPrice.productId, productId));
  await db.delete(review).where(eq(review.productId, productId));
};

const getImage = async (key: string) => {
  const result = await db.select().from(image).where(eq(image.key, key));
  return result[0];
};

const deleteImage = async (key: string) => {
  await db.delete(image).where(and(eq(image.key, key)));
};

const addImage = async (productId: number, key: string) => {
  await db.insert(image).values({
    key: key,
    productId: productId,
    isFeatured: false,
  });
};

const setFeaturedImage = async (key: string) => {
  const result = await db.select().from(image).where(eq(image.key, key));
  await db
    .update(image)
    .set({ isFeatured: false })
    .where(
      and(eq(image.productId, result[0].productId), eq(image.isFeatured, true))
    );
  await db.update(image).set({ isFeatured: true }).where(eq(image.key, key));
};

const deleteCategory = async (categoryId: number) => {
  await db.transaction(async (trx) => {
    const products = await trx
      .select()
      .from(product)
      .where(eq(product.categoryId, categoryId));
    for (const individualProduct of products) {
      await trx
        .delete(productPrice)
        .where(eq(productPrice.productId, individualProduct.id));
      await trx.delete(image).where(eq(image.productId, individualProduct.id));
      await trx
        .delete(review)
        .where(eq(review.productId, individualProduct.id));
    }
    await trx.delete(category).where(eq(category.id, categoryId));
  });
};

const updateCategory = async (
  categoryId: number,
  updatedCategory: UpdateCategory
) => {
  await db
    .update(category)
    .set({
      name: updatedCategory.name,
      description: updatedCategory.description,
    })
    .where(eq(category.id, categoryId));
};

export default Object.freeze({
  addProduct,
  addCategory,
  checkCategoryExists,
  checkCategoryExistWithSameName,
  getAllProducts,
  getTotalProduct,
  restockAllProducts,
  getProduct,
  updateProduct,
  addSale,
  deleteSale,
  deleteProduct,
  getImage,
  deleteImage,
  setFeaturedImage,
  deleteCategory,
  updateCategory,
  addImage,
});
