import { ApiError } from '@e-commerce-monorepo/errors';
import { AccessTokenPayload, createImageUrl } from '@e-commerce-monorepo/utils';
import httpStatus from 'http-status';
import cartRepository from '../repository/cart.repository';
import orderRepository from '../repository/order.repository';
import { OrderCreated } from '@e-commerce-monorepo/event-bus';
import stripe from '../libs/stripe';
import { expirationQueue } from '../event-bus/bull-queue/expiration-queue';

const createOrder = async (
  total: number,
  token: string,
  cartSession?: string,
  user?: AccessTokenPayload
) => {
  if (!cartSession) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart session is required');
  }

  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You must be logged in to create an order'
    );
  }

  const cart = await cartRepository.getCart(cartSession);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  if (cart.userId !== user.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Cart does not belong to user');
  }
  const cartTotal = await cartRepository.getCartTotal(cartSession);

  if (cartTotal !== total) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'One of the products price changed'
    );
  }

  const result = await orderRepository.createOrder(cartSession, user);

  if (!result.status) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Something went wrong while creating order'
    );
  } else {
    const createdOrder = await orderRepository.getOrder(result.order!.id);
    if (!createdOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    const orderCreatedEvent = new OrderCreated();
    orderCreatedEvent.publish({
      orderId: createdOrder.id,
      products: createdOrder.orderItem.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
      })),
    });
    await expirationQueue.add(
      {
        orderId: createdOrder.id,
      },
      {
        delay: 1000 * 60 * 15, // 15 minutes
      }
    );
    await cartRepository.deleteCart(cartSession);
    return {
      clientSecret: result.clientSecret,
      orderId: createdOrder.id,
    };
  }
};

const getOrders = async (user?: AccessTokenPayload) => {
  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You must be logged in to get orders'
    );
  }
  const orders = await orderRepository.getOrders(user);

  // sign images url
  for (const order of orders) {
    for (const item of order.orderItem) {
      if (item.imageUrl === null) {
        item.imageUrl = createImageUrl(item.image);
        await orderRepository.addImageUrlToOrderItem(item.id, item.imageUrl);
      }
    }
  }
  return orders;
};

const getOrder = async (orderId: string, user?: AccessTokenPayload) => {
  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You must be logged in to get orders'
    );
  }
  const order = await orderRepository.getOrder(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  if (order.userId !== user.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Order does not belong to user');
  }
  // sign images url
  for (const item of order.orderItem) {
    if (item.imageUrl === null) {
      item.imageUrl = createImageUrl(item.image);
      await orderRepository.addImageUrlToOrderItem(item.id, item.imageUrl);
    }
  }

  const clientSecret = await stripe.paymentIntents.retrieve(
    order.paymentIntentId!
  );
  return {
    ...order,
    clientSecret: clientSecret.client_secret,
  };
};

const checkPayment = async (paymentIntent: string) => {
  const payment = await stripe.paymentIntents.retrieve(paymentIntent);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  if (payment.status !== 'succeeded') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment not succeeded');
  }
  return payment;
};

export default Object.freeze({
  createOrder,
  getOrders,
  getOrder,
  checkPayment,
});
