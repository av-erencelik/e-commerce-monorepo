import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type ProductCreatedPayload = {
  id: number;
  name: string;
  price: number;
  version: number;
  stock: number;
  image: string;
  startDate: string;
  endDate: string;
};

class ProductCreated extends RMQEvent {
  public event = Subjects.productCreated;

  public async publish(message: ProductCreatedPayload): Promise<void> {
    return this.send(message);
  }
}

export { ProductCreated, ProductCreatedPayload };
