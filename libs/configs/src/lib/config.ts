import { z } from 'zod';

const envVarsSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
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
  port: envVars.PORT,
  db: {
    host: envVars.DATABASE_HOST,
    username: envVars.DATABASE_USERNAME,
    password: envVars.DATABASE_PASSWORD,
    url: envVars.DATABASE_URL,
  },
};

export { config };
