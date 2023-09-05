import { logger } from '@e-commerce-monorepo/configs';
import schedule from 'node-schedule';
import productService from '../services/product.service';

const restockOnEvery24Hours = schedule.scheduleJob('0 0 * * *', async () => {
  await productService.restockOnEvery24Hours();
  logger.info('Restock every 24 hours');
});

export default Object.freeze({
  restockOnEvery24Hours,
});
