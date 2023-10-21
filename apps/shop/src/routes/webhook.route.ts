import { Router } from 'express';
import webhookController from '../controllers/webhook.controller';

const webhookRouter = Router();

webhookRouter.post('/shop/webhook', webhookController.handleEvent);

export default webhookRouter;
