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
