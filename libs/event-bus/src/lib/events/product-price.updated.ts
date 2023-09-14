import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type ProductPriceUpdatedPayload = {
  productId: number;
  price: number;
  originalPrice: number;
  startDate: string;
  endDate: string;
};

class ProductPriceUpdated extends RMQEvent {
  public event = Subjects.productPriceUpdated;

  public async publish(message: ProductPriceUpdatedPayload): Promise<void> {
    return this.send(message);
  }
}

export { ProductPriceUpdated, ProductPriceUpdatedPayload };
