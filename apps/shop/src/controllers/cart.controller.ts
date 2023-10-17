import { logger } from '@e-commerce-monorepo/configs';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import {
  AddCart,
  CheckCart,
  RemoveFromCart,
  UpdateCartParams,
  UpdateCartQuery,
} from '../interfaces/cart';
import cartService from '../services/cart.service';
import config from '../config/config';

const addToCart = async (
  req: Request<ParamsDictionary, never, never, AddCart>,
  res: Response
) => {
  const productId = req.query.product_id;
  const quantity = req.query.quantity;
  const cartSession = req.cookies.cart_session;
  const user = req.user;
  const { cartId } = await cartService.addToCart(
    parseInt(productId),
    parseInt(quantity),
    cartSession,
    user
  );

  logger.info(`Product ${productId} added to cart with id: ${cartId}`);

  res.cookie('cart_session', cartId, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    secure: config.env === 'production',
    domain: config.domain,
  });

  res.status(httpStatus.OK).send({
    message: 'Product added to cart',
    statusCode: httpStatus.OK,
  });
};

const getCart = async (
  req: Request<ParamsDictionary, never, never>,
  res: Response
) => {
  const cartSession = req.cookies.cart_session;
  const user = req.user;
  const { cart } = await cartService.getCart(cartSession, user);
  res.cookie('cart_session', cart.id, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    secure: config.env === 'production',
    domain: config.domain,
  });

  res.status(httpStatus.OK).send({
    cart,
    message: 'Cart retrieved',
    statusCode: httpStatus.OK,
  });
};

const removeFromCart = async (
  req: Request<ParamsDictionary, never, never, RemoveFromCart>,
  res: Response
) => {
  const productId = req.query.product_id;
  const cartSession = req.cookies.cart_session;
  const user = req.user;
  await cartService.removeFromCart(parseInt(productId), cartSession, user);
  logger.info(`Product ${productId} removed from cart ${cartSession}`);
  res.status(httpStatus.OK).send({
    message: 'Product removed from cart',
    statusCode: httpStatus.OK,
  });
};

const updateCart = async (
  req: Request<
    ParamsDictionary & UpdateCartParams,
    never,
    never,
    UpdateCartQuery
  >,
  res: Response
) => {
  const productId = req.params.id;
  const quantity = req.query.quantity;
  const cartSession = req.cookies.cart_session;
  const user = req.user;
  await cartService.updateCart(
    productId,
    parseInt(quantity),
    cartSession,
    user
  );
  res.status(httpStatus.OK).send({
    message: 'Cart updated',
    statusCode: httpStatus.OK,
  });
};

const checkCart = async (
  req: Request<ParamsDictionary, never, never, CheckCart>,
  res: Response
) => {
  const total = req.query.total;
  console.log('total', total);
  const cartSession = req.cookies.cart_session;
  const user = req.user;
  await cartService.checkCart(parseFloat(total), cartSession, user);

  res.status(httpStatus.OK).send();
};

export default Object.freeze({
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
  checkCart,
});
