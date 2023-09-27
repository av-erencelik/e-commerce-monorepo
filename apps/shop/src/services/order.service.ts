import { ApiError } from '@e-commerce-monorepo/errors';
import { AccessTokenPayload, createImageUrl } from '@e-commerce-monorepo/utils';
import httpStatus from 'http-status';
import cartRepository from '../repository/cart.repository';
import orderRepository from '../repository/order.repository';
import { OrderCreated } from '@e-commerce-monorepo/event-bus';

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

  const result = await orderRepository.createOrder(cartSession, user, token);

  if (result.status === false) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Something went wrong while creating order'
    );
  }

  if (result.status === true) {
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
    return result.order;
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
      item.image = createImageUrl(item.image);
    }
  }
  return orders;
};

export default Object.freeze({
  createOrder,
  getOrders,
});
