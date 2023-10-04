import { CartState } from '@client/stores/cart-state';
import axios from 'axios';

export function checkIfPathStartsWith(path: string, subpaths: string[]) {
  return subpaths.some((subpath) => path.startsWith(subpath));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getErrorMessage(error: unknown) {
  return axios.isAxiosError(error)
    ? error.response?.data.message || 'An error occurred'
    : 'An error occurred';
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR' | 'GBP' | 'BDT';
    notation?: Intl.NumberFormatOptions['notation'];
  } = {}
) {
  const { currency = 'USD', notation = 'compact' } = options;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
  }).format(Number(price));
}

export function getTotalCartItems(cart: CartState['cart']) {
  return cart?.cartItems.reduce((acc, item) => acc + item.quantity, 0) || 0;
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function getCartTotalPrice(cart: CartState['cart']) {
  if (!cart) return 0;
  return cart.cartItems.reduce(
    (acc, item) => acc + item.quantity * item.product.price[0].price,
    0
  );
}
