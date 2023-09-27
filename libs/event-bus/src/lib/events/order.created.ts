import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type OrderCreatedPayload = {
  orderId: string;
  products: {
    id: number;
    quantity: number;
  }[];
};

class OrderCreated extends RMQEvent {
  public event = Subjects.orderCreated;

  public async publish(message: OrderCreatedPayload): Promise<void> {
    return this.send(message);
  }
}

export { OrderCreated, OrderCreatedPayload };
