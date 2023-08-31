import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './apps/auth/src/models/schema.ts',
  out: './apps/auth/src/drizzle',
  driver: 'mysql2',
  tablesFilter: ['auth_*'],
  dbCredentials: {
    connectionString:
      process.env.NODE_ENV == 'test'
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL,
  },
} as Config;
