import { Router } from 'express';
import webhookController from '../controllers/webhook.controller';

const webhookRouter = Router();

webhookRouter.post('/', webhookController.handleEvent);

export default webhookRouter;
