import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NX_CLIENT_URL: z.string().url(),
    NX_API_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    NX_JWT_SECRET: z.string(),
    NX_JWT_ISSUER: z.string(),
  },
  client: {
    NEXT_PUBLIC_NX_API_URL: z.string().url(),
    NEXT_PUBLIC_NX_CLIENT_URL: z.string().url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_NX_API_URL: process.env.NEXT_PUBLIC_NX_API_URL,
    NEXT_PUBLIC_NX_CLIENT_URL: process.env.NEXT_PUBLIC_NX_CLIENT_URL,
    NODE_ENV: process.env.NODE_ENV,
    NX_API_URL: process.env.NX_API_URL,
    NX_CLIENT_URL: process.env.NX_CLIENT_URL,
    NX_JWT_SECRET: process.env.NX_JWT_SECRET,
    NX_JWT_ISSUER: process.env.NX_JWT_ISSUER,
  },
});
