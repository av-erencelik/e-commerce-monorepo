import { z } from 'zod';
import checkPaymentSchema from '../schemas/order';

type CheckPayment = z.infer<typeof checkPaymentSchema>['query'];

export { CheckPayment };
