import { logger } from '@e-commerce-monorepo/configs';
import app from './app';
import config from './config/config';
import { RMQConnect } from '@e-commerce-monorepo/event-bus';
import restock from './lib/restock';
import { ShopListener } from './event-bus/listeners/shop.listener';

const port = config.port;
const connectionData = {
  url: config.amqp.url,
};
const server = app.listen(port, async () => {
  try {
    const mqConnection = await RMQConnect.connectUntil(connectionData);
    process.on('SIGINT', () => mqConnection.close());
    process.on('SIGTERM', () => mqConnection.close());

    mqConnection.on('disconnect', async () => {
      RMQConnect.closeConnection(mqConnection);
      process.exit(0);
    });

    restock.restockOnEvery24Hours;
    const shopListener = new ShopListener();
    shopListener.consume();
  } catch (err) {
    logger.error(err);
  }
  logger.info(`Listening at http://localhost:${port}/`);
});
server.on('error', console.error);
