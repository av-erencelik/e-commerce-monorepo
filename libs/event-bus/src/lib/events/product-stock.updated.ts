import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type ProductStockUpdatedPayload = {
  products: Array<{ id: number; stock: number }>;
};

class ProductStockUpdated extends RMQEvent {
  public event = Subjects.productStockUpdated;

  public async publish(message: ProductStockUpdatedPayload): Promise<void> {
    return this.send(message);
  }
}

export { ProductStockUpdated, ProductStockUpdatedPayload };
