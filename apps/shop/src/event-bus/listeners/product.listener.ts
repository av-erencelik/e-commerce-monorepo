import { ConsumeMessage } from 'amqplib';
import queueName from '../queue-name';
import { logger } from '@e-commerce-monorepo/configs';
import {
  ProductCreatedPayload,
  ProductPriceDeletedPayload,
  ProductPriceUpdatedPayload,
  ProductStockUpdatedPayload,
  ProductUpdatedPayload,
  RMQListener,
  RMQMessage,
  Subjects,
} from '@e-commerce-monorepo/event-bus';
import cartRepository from '../../repository/cart.repository';

export class ProductListener extends RMQListener {
  public queue = queueName;
  public events = [
    Subjects.productCreated,
    Subjects.productUpdated,
    Subjects.productDeleted,
    Subjects.productPriceDeleted,
    Subjects.productPriceUpdated,
    Subjects.productStockUpdated,
  ];

  public async consume() {
    const channel = await this.getChannel();

    channel.consume(async (consumeMessage: ConsumeMessage) => {
      const messageReceived = new RMQMessage(consumeMessage);
      const event = messageReceived.event();
      logger.info(`Received event ${event}`);
      if (event === Subjects.productCreated) {
        const payload = messageReceived.payload() as ProductCreatedPayload;
        logger.info(`Product created ${payload.name}`);
        const productExists = await cartRepository.checkProductExists(
          payload.id
        );
        if (!productExists) {
          await cartRepository.createProduct(payload);
        }
      } else if (event === Subjects.productUpdated) {
        const payload = messageReceived.payload() as ProductUpdatedPayload;
        logger.info(`Product updated ${payload.name}`);
        const product = await cartRepository.getProductById(payload.id);
        if (product) {
          if (product.version <= payload.version) {
            await cartRepository.updateProduct(payload);
          } else {
            throw new Error('Product version is not updated');
          }
        } else {
          throw new Error('Product not found');
        }
      } else if (event === Subjects.productDeleted) {
        const payload = messageReceived.payload() as ProductPriceDeletedPayload;
        logger.info(`Product deleted ${payload.id}`);
        const product = await cartRepository.getProductById(payload.id);
        if (product) {
          await cartRepository.deleteProduct(payload.id);
        } else {
          throw new Error('Product not found');
        }
      } else if (event === Subjects.productPriceDeleted) {
        const payload = messageReceived.payload() as ProductPriceDeletedPayload;
        logger.info(`Product price deleted ${payload.id}`);
        const price = await cartRepository.getProductPriceById(payload.id);
        if (price) {
          await cartRepository.deleteProductPrice(payload.id);
        } else {
          throw new Error('Product price not found');
        }
      } else if (event === Subjects.productPriceUpdated) {
        const payload = messageReceived.payload() as ProductPriceUpdatedPayload;
        logger.info(`Product price updated ${payload.productId}`);
        const price = await cartRepository.getProductPriceById(
          payload.productId
        );
        if (price) {
          await cartRepository.updateProductPrice(payload);
        } else {
          throw new Error('Product price not found');
        }
      } else if (event === Subjects.productStockUpdated) {
        const payload = messageReceived.payload() as ProductStockUpdatedPayload;
        await cartRepository.reStockProducts(payload);
      }

      channel.ack(consumeMessage);
    });
  }
}
