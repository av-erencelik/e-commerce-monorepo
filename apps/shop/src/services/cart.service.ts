import httpStatus from 'http-status';
import { ApiError } from '@e-commerce-monorepo/errors';
import cartRepository from '../repository/cart.repository';
import { v4 as uuid } from 'uuid';
import { AccessTokenPayload, createImageUrl } from '@e-commerce-monorepo/utils';
const addToCart = async (
  productId: number,
  quantity: number,
  cartSession?: string,
  user?: AccessTokenPayload
) => {
  const productExists = await cartRepository.checkProductExists(productId);
  if (!productExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  let cartId: string;
  if (cartSession) {
    const cart = await cartRepository.checkCartExistsBySession(cartSession);
    if (cart) {
      if (user && cart.userId !== user.userId) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Cart does not belong to user'
        );
      }
      cartId = cartSession;
    } else {
      const id = uuid();
      await cartRepository.createCart(id, user);
      cartId = id;
    }
  } else {
    if (user) {
      const cart = await cartRepository.getCartByUserId(user.userId);
      if (cart) {
        cartId = cart.id;
      } else {
        const id = uuid();
        await cartRepository.createCart(id, user);
        cartId = id;
      }
    } else {
      const id = uuid();
      await cartRepository.createCart(id, user);
      cartId = id;
    }
  }

  await cartRepository.addToCart(productId, quantity, cartId);

  return {
    cartId,
  };
};

const getCart = async (cartSession?: string, user?: AccessTokenPayload) => {
  let cartId: string;
  if (cartSession) {
    const cartExists = await cartRepository.checkCartExistsBySession(
      cartSession
    );
    if (cartExists) {
      cartId = cartSession;
    } else {
      const id = uuid();
      await cartRepository.createCart(id, user);
      cartId = id;
    }
  } else {
    if (user) {
      const cart = await cartRepository.getCartByUserId(user.userId);
      if (cart) {
        cartId = cart.id;
      } else {
        const id = uuid();
        await cartRepository.createCart(id, user);
        cartId = id;
      }
    } else {
      const id = uuid();
      await cartRepository.createCart(id, user);
      cartId = id;
    }
  }

  const cart = await cartRepository.getCart(cartId);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  if (user && !cart.userId) {
    const usersCart = await cartRepository.getCartByUserId(user.userId);
    if (usersCart) {
      cartId = usersCart.id;
    } else {
      await cartRepository.addUserToCart(cartId, user);
    }
  }

  if (user && cart.userId !== user.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Cart does not belong to user');
  }
  if (cart.userId && !user) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Cart does not belong to user');
  }

  // presign cart items images
  const cartItems = cart.cartItems.map((item) => {
    const url = createImageUrl(item.product.image);
    return {
      ...item,
      product: {
        ...item.product,
        image: url,
      },
    };
  });

  return {
    cart: {
      ...cart,
      cartItems,
    },
  };
};

const removeFromCart = async (
  productId: number,
  cartSession?: string,
  user?: AccessTokenPayload
) => {
  if (!cartSession) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart session is required');
  }

  const cart = await cartRepository.checkCartExistsBySession(cartSession);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  if ((user && cart.userId !== user.userId) || (!user && cart.userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Cart does not belong to user');
  }

  const productExists = await cartRepository.checkProductExists(productId);

  if (!productExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  await cartRepository.removeFromCart(productId, cartSession);
};

const updateCart = async (
  productId: number,
  quantity: number,
  cartSession?: string,
  user?: AccessTokenPayload
) => {
  if (!cartSession) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart session is required');
  }
  const cart = await cartRepository.checkCartExistsBySession(cartSession);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  if ((user && cart.userId !== user.userId) || (!user && cart.userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Cart does not belong to user');
  }
  const productExists = await cartRepository.checkProductExists(productId);
  if (!productExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const productOnCart = await cartRepository.checkProductExistsOnCart(
    productId,
    cartSession
  );
  if (!productOnCart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found on cart');
  }
  await cartRepository.updateCart(productId, quantity, cartSession);
};

const checkCart = async (
  total: number,
  cartSession?: string,
  user?: AccessTokenPayload
) => {
  if (!cartSession) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart session is required');
  }
  if (!total) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Total is required');
  }

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You must be logged in');
  }

  const cart = await cartRepository.checkCartExistsBySession(cartSession);
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
};

export default Object.freeze({
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
  checkCart,
});
