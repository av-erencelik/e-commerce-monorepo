import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type ProductUpdatedPayload = {
  id: number;
  name: string;
  price: number;
  version: number;
  stock: number;
  image: string;
  startDate: string;
  endDate: string;
  priceId: number;
};

class ProductUpdated extends RMQEvent {
  public event = Subjects.productUpdated;

  public async publish(message: ProductUpdatedPayload): Promise<void> {
    return this.send(message);
  }
}

export { ProductUpdated, ProductUpdatedPayload };
