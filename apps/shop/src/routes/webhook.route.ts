import { Router } from 'express';
import express from 'express';
import webhookController from '../controllers/webhook.controller';

const webhookRouter = Router();

webhookRouter.post(
  '/shop/webhook',
  express.raw({ type: '*/*' }),
  webhookController.handleEvent
);

export default webhookRouter;
