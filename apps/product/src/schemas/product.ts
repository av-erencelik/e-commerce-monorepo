import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { category } from '../models/schema';

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

const addCategorySchema = createInsertSchema(category);

export { preSignedUrlSchema, addProductSchema, addCategorySchema };
