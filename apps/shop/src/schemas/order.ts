import { z } from 'zod';

const checkPaymentSchema = z.object({
  query: z.object({
    payment_intent: z.string(),
  }),
});

export default checkPaymentSchema;
