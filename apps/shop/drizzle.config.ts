import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './apps/shop/src/models/schema.ts',
  out: './apps/shop/src/drizzle',
  driver: 'mysql2',
  tablesFilter: ['shop_*'],
  dbCredentials: {
    connectionString:
      process.env.NODE_ENV == 'test'
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL,
  },
} as Config;
