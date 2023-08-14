import express from 'express';
import {
  errorConverterMiddleware,
  errorHandler,
  notFoundHandler,
} from '@e-commerce-monorepo/errors';
import {
  successHandler as successHandlerLogger,
  errorHandler as errorHandlerLogger,
} from '@e-commerce-monorepo/configs';
import { currentUser, xssClean } from '@e-commerce-monorepo/middlewares';
import router from './routes/routes';
import cookieParser from 'cookie-parser';
import config from './config/config';

const app = express();

if (config.env !== 'test') {
  app.use(successHandlerLogger);
  app.use(errorHandlerLogger);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(xssClean);
app.use(currentUser);

app.use(router);

app.use(notFoundHandler);
app.use(errorConverterMiddleware);
app.use(errorHandler);

export default app;
