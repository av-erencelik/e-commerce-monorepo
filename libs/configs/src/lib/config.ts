import { z } from 'zod';

const envVarsSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  JWT_SECRET: z.string().min(32).max(128).describe('The secret of the JWT'),
  JWT_EXPIRES_IN: z
    .string()
    .describe('The expiration time of the JWT')
    .optional(),
  JWT_ISSUER: z.string().describe('The issuer of the JWT').optional(),
  PORT: z.string().default('3000'),
  DATABASE_HOST: z.string().describe('The host of the database'),
  DATABASE_USERNAME: z.string().describe('The username of the database'),
  DATABASE_PASSWORD: z.string().describe('The password of the database'),
  DATABASE_URL: z.string().url().describe('The URL of the database').optional(),
  TEST_DATABASE_URL: z
    .string()
    .url()
    .describe('The URL of the test database')
    .optional(),
});

const envVars = envVarsSchema.parse(process.env);

const config = {
  env: envVars.NODE_ENV,
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: parseInt(envVars.JWT_EXPIRES_IN) || 600,
    issuer: envVars.JWT_ISSUER || 'e-commerce-monorepo',
  },
  port: envVars.PORT,
  db: {
    host: envVars.DATABASE_HOST,
    username: envVars.DATABASE_USERNAME,
    password: envVars.DATABASE_PASSWORD,
    url: envVars.DATABASE_URL,
  },
};

export { config };
