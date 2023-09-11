import { z } from 'zod';

export const createCategoryFormSchema = z.object({
  name: z.string().trim().min(1).max(256),
  description: z.string().trim().min(1).max(256),
  categoryId: z.string().superRefine((val, ctx) => {
    if (!/^[0-9]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Category must be selected correctly',
        path: [],
      });
    }
  }),
});

export const editSubcategoryFormSchema = z.object({
  name: z.string().trim().min(1).max(256),
  description: z.string().trim().min(1).max(256),
  categoryId: z.string().superRefine((val, ctx) => {
    if (!/^[0-9]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Category must be selected correctly',
        path: [],
      });
    }
  }),
  id: z.string().superRefine((val, ctx) => {
    if (!/^[0-9]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Subcategory must be selected correctly',
        path: [],
      });
    }
  }),
});

export const createSubcategorySchema = z.object({
  name: z.string().trim().min(1).max(256),
  description: z.string().trim().min(1).max(256),
  categoryId: z.number().int().positive(),
});

export const editSubcategorySchema = z.object({
  name: z.string().trim().min(1).max(256),
  description: z.string().trim().min(1).max(256),
  categoryId: z.number().int().positive(),
  id: z.number().int().positive(),
});
