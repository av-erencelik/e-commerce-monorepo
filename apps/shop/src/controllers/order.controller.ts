import { ParamsDictionary } from 'express-serve-static-core';
import { Request, Response } from 'express';
import { CreateOrder } from '../interfaces/cart';
import { logger } from '@e-commerce-monorepo/configs';
import httpStatus from 'http-status';
import orderService from '../services/order.service';
import { ApiError } from '@e-commerce-monorepo/errors';

const createOrder = async (
  req: Request<ParamsDictionary, never, never, CreateOrder>,
  res: Response
) => {
  const cartSession = req.cookies.cart_session;
  const user = req.user;
  const total = req.query.total;
  const token = req.query.token;
  const order = await orderService.createOrder(
    parseFloat(total),
    token,
    cartSession,
    user
  );
  if (!order) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order could not be created');
  }
  logger.info(`Order ${order.id} created`);
  res.status(httpStatus.CREATED).send({
    message: 'Order created',
    statusCode: httpStatus.CREATED,
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

export default Object.freeze({
  createOrder,
  getOrders,
});
