import Queue from 'bull';
import config from '../../config/config';
import orderRepository from '../../repository/order.repository';
import { logger } from '@e-commerce-monorepo/configs';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
});

expirationQueue.process(async (job) => {
  logger.info('deleting order if not completed', { orderId: job.data.orderId });
  orderRepository.deleteOrder(job.data.orderId);
});

export { expirationQueue };
