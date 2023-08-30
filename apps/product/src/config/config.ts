import { baseConfig } from '@e-commerce-monorepo/configs';
import { z } from 'zod';

const envVarsSchema = z.object({
  JWT_SECRET: z.string().min(32).max(128).default('secret'),
  JWT_ISSUER: z.string().describe('JWT issuer'),
  DATABASE_URL: z.string().url().describe('Database URL'),
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
};

export default config;
