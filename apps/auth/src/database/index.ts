import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { drizzle as drizzleTest } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import { config } from '@e-commerce-monorepo/configs';
const connection = connect({
  host: config.db.host,
  username: config.db.username,
  password: config.db.password,
});

const connectionTest = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'test',
  password: 'test',
});

const db =
  config.env == 'test'
    ? drizzleTest(connectionTest)
    : drizzle(connection, {
        logger: config.env !== 'production' ? true : false,
      });

export default db;
