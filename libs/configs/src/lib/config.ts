import { z } from 'zod';

const envVarsSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().default('3000'),
});

const envVars = envVarsSchema.parse(process.env);

const baseConfig = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
};

export { baseConfig };
