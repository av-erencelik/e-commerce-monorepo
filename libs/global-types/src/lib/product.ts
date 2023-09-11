import { z } from 'zod';

export const EditProductSchema = z.object({
  name: z.string().trim().min(1).max(256),
  description: z.string().trim().min(1).max(256),
  stock: z.number().int().positive(),
  weight: z.number().int().positive().optional(),
  categoryId: z.number().int().positive(),
  subCategoryId: z.number().int().positive(),
  price: z.number().positive().optional(),
  images: z
    .array(
      z.object({
        key: z.string(),
        isFeatured: z.boolean().default(false),
        url: z.string(),
        type: z.string().optional(),
        file: z.any(),
      })
    )
    .superRefine((val, ctx) => {
      // length must be more than 1
      if (val.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Images must be more than one',
          path: [],
        });
      }
      // check isFeatured true more than one and not zero
      const featuredImages = val.filter((v) => v.isFeatured);
      if (featuredImages.length > 1 || featuredImages.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Featured image must be one',
          path: [],
        });
      }
    }),
});

export const EditProductFormSchema = z.object({
  name: z.string().trim().min(1).max(256),
  description: z.string().trim().min(1).max(256),
  stock: z.string().superRefine((val, ctx) => {
    if (!/^[0-9]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Stock must be number',
        path: [],
      });
    }
  }),
  weight: z.preprocess((val) => {
    if (val === '') {
      return undefined;
    }
    return val;
  }, z.string().optional()),
  subCategoryId: z.string().superRefine((val, ctx) => {
    if (!/^[0-9]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Category must be number',
        path: [],
      });
    }
  }),
  price: z.string().superRefine((val, ctx) => {
    if (!/^[0-9]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Price must be number',
        path: [],
      });
    }
  }),
  images: z
    .array(
      z.object({
        key: z.string(),
        isFeatured: z.boolean().default(false),
        url: z.string(),
        type: z.string().optional(),
        file: z.any(),
      })
    )
    .superRefine((val, ctx) => {
      // length must be more than 1
      if (val.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Images must be more than one',
          path: [],
        });
      }
      // check isFeatured true more than one and not zero
      const featuredImages = val.filter((v) => v.isFeatured);
      if (featuredImages.length > 1 || featuredImages.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Featured image must be one',
          path: [],
        });
      }
    }),
});

export const addSaleSchema = z.object({
  discountPrice: z.number().int().positive(),
  startDate: z.date(),
  endDate: z.date(),
  originalPrice: z.number().int().positive(),
});

export const addSaleFormSchema = z
  .object({
    discountPrice: z.string().superRefine((val, ctx) => {
      if (!/^[0-9]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Discount price must be number',
          path: [],
        });
      }
    }),
    startDate: z.date(),
    endDate: z.date(),
    productId: z.string().superRefine((val, ctx) => {
      if (!/^[0-9]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Product id must be number',
          path: [],
        });
      }
    }),
    originalPrice: z.string().superRefine((val, ctx) => {
      if (!/^[0-9]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Original price must be number',
          path: [],
        });
      }
    }),
  })
  .superRefine((val, ctx) => {
    if (val.discountPrice >= val.originalPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Discount price must be less than original price',
        path: [],
      });
    }
  });
