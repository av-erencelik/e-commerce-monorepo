import { baseConfig } from '@e-commerce-monorepo/configs';
import { z } from 'zod';

const envVarsSchema = z.object({
  JWT_SECRET: z.string().min(32).max(128).default('secret'),
  JWT_EXPIRES_IN: z.string().describe('JWT expiration in miliseconds'),
  JWT_ISSUER: z.string().describe('JWT issuer'),
  REFRESH_TOKEN_EXPIRES_IN: z
    .string()
    .describe('Refresh token expiration in seconds'),
  DATABASE_URL: z.string().url().describe('Database URL'),
  REDIS_HOST: z.string().describe('Redis host'),
  REDIS_PORT: z.string().describe('Redis port'),
  REDIS_PASSWORD: z.string().describe('Redis password'),
  VERIFICATION_TOKEN_EXPIRES_IN: z
    .string()
    .describe('Verification token expiration in milliseconds'),
});

const envVars = envVarsSchema.parse(process.env);

const config = {
  ...baseConfig,
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: parseInt(envVars.JWT_EXPIRES_IN),
    issuer: envVars.JWT_ISSUER,
  },
  refreshToken: {
    expiresIn: parseInt(envVars.REFRESH_TOKEN_EXPIRES_IN),
  },
  db: {
    url: envVars.DATABASE_URL,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: parseInt(envVars.REDIS_PORT),
    password: envVars.REDIS_PASSWORD,
  },
  verificationToken: {
    expiresIn: parseInt(envVars.VERIFICATION_TOKEN_EXPIRES_IN),
  },
};

export default config;
