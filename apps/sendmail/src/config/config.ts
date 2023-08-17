import { baseConfig } from '@e-commerce-monorepo/configs';
import { z } from 'zod';

const envVarsSchema = z.object({
  DATABASE_URL: z.string().url().describe('Database URL'),
  RESEND_API_KEY: z.string().describe('Resend API Key'),
  EMAIL: z.string().email().describe('Email'),
});

const envVars = envVarsSchema.parse(process.env);

const config = {
  ...baseConfig,
  db: {
    url: envVars.DATABASE_URL,
  },
  resend: {
    apiKey: envVars.RESEND_API_KEY,
  },
  email: envVars.EMAIL,
};

export default config;
