import { baseConfig } from '@e-commerce-monorepo/configs';
import { z } from 'zod';

const envVarsSchema = z.object({
  JWT_SECRET: z.string().min(32).max(128).default('secret'),
  JWT_ISSUER: z.string().describe('JWT issuer'),
  DATABASE_URL: z.string().url().describe('Database URL'),
  PUBLIC_ACCESS_KEY: z.string().default('S3 public access key'),
  SECRET_ACCESS_KEY: z.string().default('S3 secret access key'),
  BUCKET: z.string().default('S3 bucket name'),
  REGION: z.string().default('S3 region'),
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
  s3: {
    accessKey: envVars.PUBLIC_ACCESS_KEY,
    secretKey: envVars.SECRET_ACCESS_KEY,
    bucket: envVars.BUCKET,
    region: envVars.REGION,
  },
};

export default config;
