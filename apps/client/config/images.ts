import { Image } from '../types';

type Images = {
  [key: string]: Image;
};

export const images: Images = {
  wholeWheatBread: {
    src: '/products/whole-wheat.webp',
    alt: 'Whole Wheat Bread',
  },
  einkornBread: {
    src: '/products/einkorn.webp',
    alt: 'Einkorn Bread',
  },
  sourdoughBread: {
    src: '/products/sourdough.webp',
    alt: 'Sourdough Bread',
  },
  darkChocolate: {
    src: '/products/dark-chocolate.webp',
    alt: 'Dark Chocolate',
  },
  milkChocolate: {
    src: '/products/milk-chocolate.webp',
    alt: 'Milk Chocolate',
  },
  whiteChocolate: {
    src: '/products/white-chocolate.webp',
    alt: 'White Chocolate',
  },
};
