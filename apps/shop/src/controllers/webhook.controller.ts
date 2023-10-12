/// <reference types="stripe-event-types" />

import { Request, Response } from 'express';
import config from '../config/config';
import stripe from '../libs/stripe';
import Stripe from 'stripe';
import webhookService from '../services/webhook.service';

const handleEvent = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  if (typeof sig !== 'string') return res.status(401).end();
  const payload = req.body;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      config.stripe.webhookSecret
    ) as Stripe.DiscriminatedEvent;
    await webhookService.handleEvent(event);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  res.send();
};

export default Object.freeze({
  handleEvent,
});
