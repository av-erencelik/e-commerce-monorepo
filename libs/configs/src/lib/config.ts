import { z } from 'zod';

const envVarsSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().default('3000'),
  AMQP_URL: z.string().url().describe('AMQP URL'),
  CLIENT_URL: z.string().url().describe('Client URL'),
});

const envVars = envVarsSchema.parse(process.env);

const baseConfig = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  amqp: {
    url: envVars.AMQP_URL,
  },
  client: {
    url: envVars.CLIENT_URL,
  },
};

export { baseConfig };
