import { logger } from '@e-commerce-monorepo/configs';
import app from './app';
import config from './config/config';

const port = config.port;
const server = app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
