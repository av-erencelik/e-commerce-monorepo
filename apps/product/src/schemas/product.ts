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
    stock: z.string().transform((val, ctx) => {
      const parsed = parseInt(val);
      if (isNaN(parsed) || parsed <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Stock must be a positive number',
        });
        return z.never();
      }
      return parsed;
    }),
    weight: z
      .string()
      .optional()
      .transform((val, ctx) => {
        if (!val) return null;
        const parsed = parseInt(val);
        if (isNaN(parsed) || parsed <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Weight must be a positive number',
          });
          return z.never();
        }
        return parsed;
      }),
    categoryId: z.string(),
    price: z.string().transform((val, ctx) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed) || parsed <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Stock must be a positive number',
        });
        return z.never();
      }
      return val;
    }),
    images: z.array(
      z.object({
        key: z.string(),
        isFeatured: z.boolean().default(false),
      })
    ),
  }),
});

export { preSignedUrlSchema, addProductSchema };
