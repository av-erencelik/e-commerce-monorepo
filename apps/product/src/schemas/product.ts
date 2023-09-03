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

export { preSignedUrlSchema };
