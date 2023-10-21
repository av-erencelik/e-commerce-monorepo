import { ParamsDictionary } from 'express-serve-static-core';
import { Request, Response } from 'express';
import { CreateOrder, GetOrder } from '../interfaces/cart';
import { logger } from '@e-commerce-monorepo/configs';
import httpStatus from 'http-status';
import orderService from '../services/order.service';
import { ApiError } from '@e-commerce-monorepo/errors';
import { CheckPayment } from '../interfaces/order';

const createOrder = async (
  req: Request<ParamsDictionary, never, never, CreateOrder>,
  res: Response
) => {
  const cartSession = req.cookies.cart_session;
  const user = req.user;
  const total = req.query.total;
  const token = req.query.token;
  const { clientSecret, orderId } = await orderService.createOrder(
    parseFloat(total),
    token,
    cartSession,
    user
  );
  if (!clientSecret) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order could not be created');
  }
  logger.info(`Order with ${clientSecret} created`);
  res.status(httpStatus.CREATED).send({
    message: 'Order created',
    statusCode: httpStatus.CREATED,
    data: { clientSecret, orderId },
  });
};

const getOrders = async (req: Request, res: Response) => {
  const user = req.user;
  const orders = await orderService.getOrders(user);
  res.status(httpStatus.OK).send({
    message: 'Orders retrieved',
    statusCode: httpStatus.OK,
    data: orders,
  });
};

const getOrder = async (
  req: Request<ParamsDictionary & GetOrder>,
  res: Response
) => {
  const orderId = req.params.id;
  const user = req.user;
  const order = await orderService.getOrder(orderId, user);
  res.status(httpStatus.OK).send({
    message: 'Order retrieved',
    statusCode: httpStatus.OK,
    data: { order },
  });
};

const checkPayment = async (
  req: Request<ParamsDictionary, never, never, CheckPayment>,
  res: Response
) => {
  const paymentIntent = req.query.payment_intent;
  const payment = await orderService.checkPayment(paymentIntent);
  res.status(httpStatus.OK).send({
    message: 'Payment checked',
    statusCode: httpStatus.OK,
    data: { payment_status: payment.status },
  });
};

export default Object.freeze({
  createOrder,
  getOrders,
  getOrder,
  checkPayment,
});
