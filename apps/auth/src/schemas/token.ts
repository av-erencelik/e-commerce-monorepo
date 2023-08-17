import { z } from 'zod';

const verifyTokenSchema = z.object({
  query: z
    .object({
      token: z.string().uuid(),
    })
    .strict(),
});

export { verifyTokenSchema };
