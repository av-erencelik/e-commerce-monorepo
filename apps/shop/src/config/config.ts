import { baseConfig } from '@e-commerce-monorepo/configs';
import { z } from 'zod';

const envVarsSchema = z.object({
  JWT_SECRET: z.string().min(32).max(128).default('secret'),
  JWT_ISSUER: z.string().describe('JWT issuer'),
  DATABASE_URL: z.string().url().describe('Database URL'),
  REDIS_HOST: z.string().describe('Redis host'),
  REDIS_PORT: z.string().describe('Redis port'),
  REDIS_PASSWORD: z.string().describe('Redis password'),
  CLOUDFRONT_KEY_PAIR_ID: z.string().describe('Cloudfront key pair id'),
  CLOUDFRONT_PRIVATE_KEY: z.string().describe('Cloudfront private key'),
  CLOUDFRONT_URL: z.string().describe('Cloudfront url'),
  STRIPE_KEY: z.string().describe('Stripe key'),
});

const envVars = envVarsSchema.parse(process.env);

const config = {
  ...baseConfig,
  jwt: {
    secret: envVars.JWT_SECRET,
    issuer: envVars.JWT_ISSUER,
  },
  db: {
    url: envVars.DATABASE_URL,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: parseInt(envVars.REDIS_PORT),
    password: envVars.REDIS_PASSWORD,
  },
  cdn: {
    keyPairId: envVars.CLOUDFRONT_KEY_PAIR_ID,
    privateKey: envVars.CLOUDFRONT_PRIVATE_KEY,
    url: envVars.CLOUDFRONT_URL,
  },
  stripe: {
    key: envVars.STRIPE_KEY,
  },
};

export default config;
