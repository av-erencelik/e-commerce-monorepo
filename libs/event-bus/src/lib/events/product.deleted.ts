import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type ProductDeletedPayload = {
  id: number;
};

class ProductDeleted extends RMQEvent {
  public event = Subjects.productDeleted;

  public async publish(message: ProductDeletedPayload): Promise<void> {
    return this.send(message);
  }
}

export { ProductDeleted, ProductDeletedPayload };
