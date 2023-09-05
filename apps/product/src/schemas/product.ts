import { z } from 'zod';

const preSignedUrlSchema = z.object({
  body: z.object({
    images: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
      })
    ),
  }),
});

const addProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(256),
    description: z.string(),
    stock: z.number().int().positive(),
    weight: z.number().int().positive().optional(),
    categoryId: z.number().int().positive(),
    price: z.number().positive(),
    images: z.array(
      z.object({
        key: z.string(),
        isFeatured: z.boolean().default(false),
      })
    ),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(256).optional(),
    description: z.string().optional(),
    stock: z.number().int().positive().optional(),
    weight: z.number().int().positive().optional(),
    categoryId: z.number().int().positive().optional(),
    price: z.number().positive().optional(),
    images: z.array(
      z.object({
        key: z.string(),
        isFeatured: z.boolean().default(false),
      })
    ),
  }),
  params: z.object({
    productId: z.string().transform(Number),
  }),
});

const addCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(256),
    description: z.string().trim().min(1).max(256),
    id: z.number().int().positive().optional(),
  }),
});

const getAllProductsSchema = z.object({
  query: z
    .object({
      page: z.string().regex(/^\d+$/).transform(Number).optional(),
    })
    .strict(),
});

const addSaleSchema = z.object({
  params: z.object({
    productId: z.string().transform(Number),
  }),
  body: z.object({
    discountPrice: z.number().positive(),
    startDate: z.string().transform(Date.parse),
    endDate: z.string().transform(Date.parse),
    originalPrice: z.number().positive(),
  }),
});

const deleteSaleSchema = z.object({
  params: z.object({
    productId: z.string().transform(Number),
  }),
  query: z.object({
    saleId: z.string(),
  }),
});

const deleteProductSchema = z.object({
  params: z.object({
    productId: z.string().transform(Number),
  }),
});

const deleteImageSchema = z.object({
  params: z.object({
    key: z.string(),
  }),
});

const getProductSchema = z.object({
  params: z.object({
    productId: z.string().transform(Number),
  }),
});

const categorySchema = z.object({
  params: z.object({
    categoryId: z.string().transform(Number),
  }),
});

const updateCategorySchema = z.object({
  params: z.object({
    categoryId: z.string().transform(Number),
  }),
  body: z.object({
    name: z.string().trim().min(1).max(256),
    description: z.string().trim().min(1).max(256),
  }),
});

export {
  preSignedUrlSchema,
  addProductSchema,
  addCategorySchema,
  getAllProductsSchema,
  updateProductSchema,
  addSaleSchema,
  deleteSaleSchema,
  deleteProductSchema,
  deleteImageSchema,
  getProductSchema,
  categorySchema,
  updateCategorySchema,
};
