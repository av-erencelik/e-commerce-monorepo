import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type OrderCancelledPayload = {
  orderId: string;
  products: {
    id: number;
    quantity: number;
  }[];
};

class OrderCancelled extends RMQEvent {
  public event = Subjects.orderCancelled;

  public async publish(message: OrderCancelledPayload): Promise<void> {
    return this.send(message);
  }
}

export { OrderCancelled, OrderCancelledPayload };
