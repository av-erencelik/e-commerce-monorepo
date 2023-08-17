import express from 'express';
import config from './config/config';
import {
  successHandler as successHandlerLogger,
  errorHandler as errorHandlerLogger,
} from '@e-commerce-monorepo/configs';
const app = express();

if (config.env !== 'test') {
  app.use(successHandlerLogger);
  app.use(errorHandlerLogger);
}

export default app;
