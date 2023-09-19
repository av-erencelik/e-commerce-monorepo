import Stripe from 'stripe';
import config from '../config/config';
const stripe = new Stripe(config.stripe.key, {
  apiVersion: '2023-08-16',
});

export default stripe;
