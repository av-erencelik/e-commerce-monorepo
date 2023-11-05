import { and, eq, sql } from 'drizzle-orm';
import db from '../database/sql';
import {
  product,
  image,
  productPrice,
  category,
  subCategory,
} from '../models/schema';
import {
  AddCategory,
  AddProduct,
  Product,
  Sale,
  UpdateCategory,
  UpdateProduct,
} from '../interfaces/product';
import { logger } from '@e-commerce-monorepo/configs';

const addProduct = async (newProduct: AddProduct) => {
  const { images } = newProduct;
  await db.insert(product).values({
    name: newProduct.name,
    description: newProduct.description,
    categoryId: newProduct.categoryId,
    subCategoryId: newProduct.subCategoryId,
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

const addSubCategory = async (newSubCategory: AddCategory) => {
  await db.insert(subCategory).values({
    name: newSubCategory.name,
    description: newSubCategory.description,
    categoryId: newSubCategory.categoryId,
  });

  const addedCategory = await db
    .select()
    .from(subCategory)
    .where(eq(subCategory.name, newSubCategory.name));

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

const checkSubCategoryExists = async (subCategoryId: number) => {
  // check if sub category exists
  const response = await db
    .select()
    .from(subCategory)
    .where(eq(subCategory.id, subCategoryId));
  return response.length > 0;
};

const checkSubCategoryExistWithSameName = async (name: string) => {
  // check if category exists
  const response = await db
    .select()
    .from(subCategory)
    .where(eq(subCategory.name, name));
  return {
    exists: response.length > 0,
    id: response.length > 0 ? response[0].id : null,
  };
};

const getNewestProducts = async () => {
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
      subCategory: true,
    },
    orderBy: (product, { desc }) => desc(product.createdAt),
    limit: 6,
    offset: 0,
  });
  return products.map((product) => {
    return {
      ...product,
      stock: product.stock - product.dailySales,
    };
  });
};

const getMostSoldProducts = async () => {
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
      subCategory: true,
    },
    orderBy: (product, { desc }) => desc(product.dailySales),
    limit: 6,
    offset: 0,
  });
  return products.map((product) => {
    return {
      ...product,
      stock: product.stock - product.dailySales,
    };
  });
};

const getAllProducts = async (
  page = 1,
  subcategory_id?: number,
  sort_by?: string,
  order?: string,
  category_id?: number
) => {
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
    where: (product, { eq, and }) =>
      and(
        subcategory_id
          ? eq(product.subCategoryId, subcategory_id)
          : eq(product.subCategoryId, product.subCategoryId),
        category_id
          ? eq(product.categoryId, category_id)
          : eq(product.categoryId, product.categoryId)
      ),
    limit: 12,
    offset: (page - 1) * 12,
    orderBy: (product, { desc, asc }) =>
      sort_by === 'created_at'
        ? order === 'asc'
          ? asc(product.createdAt)
          : desc(product.createdAt)
        : desc(product.id),
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
      subCategory: true,
    },
  });

  if (sort_by === 'price') {
    if (order === 'asc') {
      products.sort((a, b) => a.price[0].price - b.price[0].price);
    } else {
      products.sort((a, b) => b.price[0].price - a.price[0].price);
    }
  }

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
      subCategory: true,
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

const getTotalProduct = async (
  category_id?: number,
  subcategory_id?: number
) => {
  // enter different where clause depending on if category_id or subcategory_id is present
  const where = and(
    category_id
      ? eq(product.categoryId, category_id)
      : eq(product.categoryId, product.categoryId),
    subcategory_id
      ? eq(product.subCategoryId, subcategory_id)
      : eq(product.subCategoryId, product.subCategoryId)
  );
  const totalProduct = await db
    .select({ count: sql<number>`count(*)` })
    .from(product)
    .where(where);
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
  return allProducts.map((product) => {
    return {
      id: product.id,
      stock: product.stock,
    };
  });
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
        subCategoryId: updatedProduct.subCategoryId
          ? updatedProduct.subCategoryId
          : currentProduct.subCategoryId,
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
      const editedImages = images.map((image) => {
        return {
          ...image,
          productId: productId,
        };
      });

      // take editedImages thare not in currentProduct images
      const imagesToAdd = editedImages.filter(
        (image) =>
          !currentProduct.images.some(
            (currentImage) => currentImage.key === image.key
          )
      );
      if (imagesToAdd.length > 0) await db.insert(image).values(imagesToAdd);

      // take currentProduct images that are not in updatedProduct images
      const imagesToDelete =
        currentProduct.images.length > 0
          ? currentProduct.images.filter(
              (image) =>
                !images.some((updatedImage) => updatedImage.key === image.key)
            )
          : [];

      // delete images that are not in updatedProduct images
      for (const imageToDelete of imagesToDelete) {
        await db.delete(image).where(eq(image.key, imageToDelete.key));
      }
    }
    return true;
  } catch (err) {
    logger.error(err);
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

const getSale = async (saleId: number) => {
  const sale = await db
    .select()
    .from(productPrice)
    .where(eq(productPrice.id, saleId));
  return sale[0];
};

const deleteProduct = async (productId: number) => {
  await db.delete(product).where(eq(product.id, productId));
  await db.delete(image).where(eq(image.productId, productId));
  await db.delete(productPrice).where(eq(productPrice.productId, productId));
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

const deleteSubCategory = async (categoryId: number) => {
  await db.transaction(async (trx) => {
    const products = await trx
      .select()
      .from(product)
      .where(eq(product.subCategoryId, categoryId));
    for (const individualProduct of products) {
      await trx
        .delete(productPrice)
        .where(eq(productPrice.productId, individualProduct.id));
      await trx.delete(image).where(eq(image.productId, individualProduct.id));
    }
    await trx.delete(product).where(eq(product.subCategoryId, categoryId));
    await trx.delete(subCategory).where(eq(subCategory.id, categoryId));
  });
};

const updateSubCategory = async (
  categoryId: number,
  updatedCategory: UpdateCategory
) => {
  await db
    .update(subCategory)
    .set({
      name: updatedCategory.name,
      description: updatedCategory.description,
      categoryId: updatedCategory.categoryId,
    })
    .where(eq(subCategory.id, categoryId));
  await db
    .update(product)
    .set({ categoryId: updatedCategory.categoryId })
    .where(eq(product.subCategoryId, categoryId));
};

const getCategories = async () => {
  const categories = await db.query.category.findMany({
    with: {
      subCategories: true,
    },
  });
  return categories;
};

const getSubCategories = async () => {
  const subCategories = await db.query.subCategory.findMany({
    with: {
      category: true,
    },
  });
  return subCategories;
};

const getSubcategory = async (subCategoryId: number) => {
  const subCategory = await db.query.subCategory.findFirst({
    where: (subCategory, { eq }) => eq(subCategory.id, subCategoryId),
    with: {
      category: true,
    },
  });
  return subCategory;
};

const getSales = async () => {
  const sales = await db.query.productPrice.findMany({
    columns: {
      endDate: true,
      id: true,
      originalPrice: true,
      price: true,
      productId: true,
      startDate: true,
    },
    where: (price, { sql }) => sql`${price.originalPrice} > ${price.price}`,
    orderBy: (price, { desc }) => desc(price.startDate),
    with: {
      product: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });
  return sales;
};

const getAllProductsIds = async () => {
  const products = await db
    .select({ id: product.id, name: product.name })
    .from(product);
  return products;
};

const updateStock = async (productId: number, quantity: number) => {
  await db
    .update(product)
    .set({
      stock: sql<number>`stock - ${quantity}`,
      dailySales: sql<number>`daily_sales + ${quantity}`,
    })
    .where(eq(product.id, productId));
};

const updateStockAfterCancel = async (productId: number, quantity: number) => {
  await db
    .update(product)
    .set({
      stock: sql<number>`stock + ${quantity}`,
      dailySales: sql<number>`daily_sales - ${quantity}`,
    })
    .where(eq(product.id, productId));
};

const addUrlToImage = async (key: string, url: string) => {
  await db
    .update(image)
    .set({
      url: url,
    })
    .where(eq(image.key, key));
};

export default Object.freeze({
  addProduct,
  addSubCategory,
  checkCategoryExists,
  checkSubCategoryExists,
  checkSubCategoryExistWithSameName,
  getAllProducts,
  getNewestProducts,
  getMostSoldProducts,
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
  deleteSubCategory,
  updateSubCategory,
  addImage,
  getCategories,
  getSubCategories,
  getSubcategory,
  getSales,
  getAllProductsIds,
  getSale,
  updateStock,
  updateStockAfterCancel,
  addUrlToImage,
});
