import { z } from 'zod';

export const addCartSchema = z.object({
  query: z.object({
    product_id: z.string().superRefine((val, ctx) => {
      if (!/^[0-9]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Product id must be number',
          path: [],
        });
      }
    }),
    quantity: z.string().superRefine((val, ctx) => {
      if (!/^[0-9]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Quantity must be number',
          path: [],
        });
      }
    }),
  }),
});

export const removeFromCartSchema = z.object({
  query: z.object({
    product_id: z.string().superRefine((val, ctx) => {
      if (!/^[0-9]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Product id must be number',
          path: [],
        });
      }
    }),
  }),
});

export const updateCartSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  query: z.object({
    quantity: z.string().superRefine((val, ctx) => {
      if (!/^[0-9]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Quantity must be number',
          path: [],
        });
      }
    }),
  }),
});
