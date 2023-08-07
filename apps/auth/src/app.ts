import express from 'express';
import {
  errorConverter,
  errorHandler,
  notFoundHandler,
} from '@e-commerce-monorepo/errors';
import {
  config,
  successHandler as successHandlerLogger,
  errorHandler as errorHandlerLogger,
} from '@e-commerce-monorepo/configs';
import { xssClean } from '@e-commerce-monorepo/middlewares';
import router from './routes/routes';

const app = express();

if (config.env !== 'test') {
  app.use(successHandlerLogger);
  app.use(errorHandlerLogger);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xssClean);

app.use(router);

app.use(notFoundHandler);
app.use(errorConverter);
app.use(errorHandler);

export default app;
