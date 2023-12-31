import {
  OrderCancelledPayload,
  OrderCreatedPayload,
  RMQListener,
  RMQMessage,
  Subjects,
} from '@e-commerce-monorepo/event-bus';
import queueName from '../queue-name';
import { ConsumeMessage } from 'amqplib';
import { logger } from '@e-commerce-monorepo/configs';
import productService from '../../services/product.service';

export class ShopListener extends RMQListener {
  public queue = queueName;
  public events = [Subjects.orderCreated, Subjects.orderCancelled];

  public async consume() {
    const channel = await this.getChannel();

    channel.consume(async (consumeMessage: ConsumeMessage) => {
      const messageReceived = new RMQMessage(consumeMessage);
      const event = messageReceived.event();
      logger.info(`Received event ${event}`);
      if (event === Subjects.orderCreated) {
        const payload = messageReceived.payload() as OrderCreatedPayload;
        await productService.updateStock(payload);
      } else if (event === Subjects.orderCancelled) {
        const payload = messageReceived.payload() as OrderCancelledPayload;
        await productService.updateStockAfterCancel(payload);
      }
      channel.ack(consumeMessage);
    });
  }
}
