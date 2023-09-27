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
    subCategoryId: z.number().int().positive(),
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
    subCategoryId: z.number().int().positive().optional(),
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

const addSubCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(256),
    description: z.string().trim().min(1).max(256),
    id: z.number().int().positive().optional(),
    categoryId: z.number().int().positive(),
  }),
});

const getAllProductsSchema = z.object({
  query: z
    .object({
      page: z.string().regex(/^\d+$/).transform(Number).optional(),
      subcategory_id: z.string().regex(/^\d+$/).transform(Number).optional(),
    })
    .strict(),
});

const getSubcategorySchema = z.object({
  params: z.object({
    subCategoryId: z.string().transform(Number),
  }),
});

const addSaleSchema = z.object({
  params: z.object({
    productId: z.string().transform(Number),
  }),
  body: z
    .object({
      discountPrice: z.number().positive(),
      startDate: z.string().transform(Date.parse),
      endDate: z.string().transform(Date.parse),
      originalPrice: z.number().positive(),
    })
    .superRefine((val, ctx) => {
      if (val.discountPrice >= val.originalPrice) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Discount price must be less than original price',
          path: [],
        });
      }
    }),
});

const deleteSaleSchema = z.object({
  params: z.object({
    productId: z.string().transform(Number),
  }),
  query: z.object({
    sale_id: z.string(),
  }),
});

const deleteProductSchema = z.object({
  params: z.object({
    productId: z.string().transform(Number),
  }),
});

const addImageSchema = z.object({
  body: z.object({
    key: z.string(),
    isFeatured: z.boolean().default(false),
  }),
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

const subCategorySchema = z.object({
  params: z.object({
    subCategoryId: z.string().transform(Number),
  }),
});

const updateSubCategorySchema = z.object({
  params: z.object({
    subCategoryId: z.string().transform(Number),
  }),
  body: z.object({
    name: z.string().trim().min(1).max(256),
    description: z.string().trim().min(1).max(256),
    categoryId: z.number().int().positive(),
  }),
});

const getFeaturedProductsSchema = z.object({
  query: z.object({
    most_sold: z.enum(['true', 'false']).optional(),
    newest: z.enum(['true', 'false']).optional(),
  }),
});

export {
  preSignedUrlSchema,
  addProductSchema,
  addSubCategorySchema,
  getAllProductsSchema,
  updateProductSchema,
  addSaleSchema,
  deleteSaleSchema,
  deleteProductSchema,
  deleteImageSchema,
  getProductSchema,
  subCategorySchema,
  updateSubCategorySchema,
  addImageSchema,
  getSubcategorySchema,
  getFeaturedProductsSchema,
};
