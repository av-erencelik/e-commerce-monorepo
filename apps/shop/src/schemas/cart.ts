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

export const checkCartSchema = z.object({
  query: z.object({
    total: z.string().superRefine((val, ctx) => {
      console.log('total', val);
      const number = parseFloat(val);

      if (isNaN(number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Total must be number',
          path: [],
        });
      }
    }),
  }),
});

export const createOrderSchema = z.object({
  query: z.object({
    total: z.string().superRefine((val, ctx) => {
      console.log('total', val);
      const number = parseFloat(val);

      if (isNaN(number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Total must be number',
          path: [],
        });
      }
    }),
    token: z.string(),
  }),
});

export const getOrderSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
