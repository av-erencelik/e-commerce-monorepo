import { logger } from '@e-commerce-monorepo/configs';
import app from './app';
import config from './config/config';
import { RMQConnect } from '@e-commerce-monorepo/event-bus';
import { MailListener } from './event-bus/listeners/mail.listener';

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
    const mailListener = new MailListener();
    mailListener.consume();
  } catch (err) {
    logger.error(err);
  }
  logger.info(`Sendmail service listening at http://localhost:${port}..`);
});
server.on('error', console.error);
