import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import { config } from '@e-commerce-monorepo/configs';

const connection = mysql.createPool(config.db.url);

const connectionTest = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'test',
  password: 'test',
});

const db = drizzle(config.env === 'test' ? connectionTest : connection, {
  logger: config.env !== 'production' ? true : false,
});

export default db;
