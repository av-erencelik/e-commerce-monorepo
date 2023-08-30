import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './apps/product/src/models/*',
  out: './apps/product/src/drizzle',
  driver: 'mysql2',
  tablesFilter: ['product_*'],
  dbCredentials: {
    connectionString:
      process.env.NODE_ENV == 'test'
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL,
  },
} as Config;
