import { NavItem, ProductNavItem } from '../types';
import { images } from './images';

export const mainNavigation: Array<NavItem | ProductNavItem> = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Breads',
    href: '/breads',
    isCategory: true,
    categories: [
      {
        title: 'Whole Wheat Bread',
        href: '/breads/wheat-bread',
        description:
          "Wholesome whole wheat loaf, nature's goodness in every bite.",
        image: images.wholeWheatBread.src,
        alt: images.wholeWheatBread.alt,
      },
      {
        title: 'Einkorn Bread',
        href: '/breads/einkorn-bread',
        description: "Nature's Original: Einkorn Loaf, Wholesome Indulgence.",
        image: images.einkornBread.src,
        alt: images.einkornBread.alt,
      },
      {
        title: 'Sourdough Bread',
        href: '/breads/sourdough-bread',
        description: 'Taste Tradition: Sourdough Bread, Crust to Crumb.',
        image: images.sourdoughBread.src,
        alt: images.sourdoughBread.alt,
      },
    ],
  },
  {
    title: 'Chocolates',
    href: '/chocolates',
    isCategory: true,
    categories: [
      {
        title: 'Dark Chocolate',
        href: '/chocolates/dark-chocolate',
        description:
          "Elegance in Every Bite: Dark Chocolate's Delicate Richness.",
        image: images.darkChocolate.src,
        alt: images.darkChocolate.alt,
      },
      {
        title: 'Milk Chocolate',
        href: '/chocolates/milk-chocolate',
        description: 'Irresistibly Smooth: Savor Our Milk Chocolate Creation.',
        image: images.milkChocolate.src,
        alt: images.milkChocolate.alt,
      },
      {
        title: 'White Chocolate',
        href: '/chocolates/white-chocolate',
        description:
          'Timeless Luxury: Savor the Creamy Bliss of White Chocolate.',
        image: images.whiteChocolate.src,
        alt: images.whiteChocolate.alt,
      },
    ],
  },
  {
    title: 'About Us',
    href: '/about',
  },
  {
    title: 'Contact Us',
    href: '/contact',
  },
];
