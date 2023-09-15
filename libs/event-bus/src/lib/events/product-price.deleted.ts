import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type ProductPriceDeletedPayload = {
  id: number;
};

class ProductPriceDeleted extends RMQEvent {
  public event = Subjects.productPriceDeleted;

  public async publish(message: ProductPriceDeletedPayload): Promise<void> {
    return this.send(message);
  }
}

export { ProductPriceDeleted, ProductPriceDeletedPayload };
