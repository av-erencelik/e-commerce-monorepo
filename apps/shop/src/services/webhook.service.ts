/// <reference types="stripe-event-types" />

import Stripe from 'stripe';
import webhookRepository from '../repository/webhook.repository';
import { logger } from '@e-commerce-monorepo/configs';

const handleEvent = async (event: Stripe.DiscriminatedEvent) => {
  if (event.type === 'payment_intent.processing') {
    const orderId = event.data.object.metadata.orderId;
    await webhookRepository.updateOrderStatusToPending(orderId);
  } else if (event.type === 'payment_intent.succeeded') {
    const orderId = event.data.object.metadata.orderId;
    const paymentId = event.data.object.id;
    const amount = event.data.object.amount;
    await webhookRepository.updateOrderStatusToPaid(orderId, paymentId, amount);
  } else {
    logger.error(`Unhandled event type: ${event.type}`);
  }
};

export default Object.freeze({
  handleEvent,
});
