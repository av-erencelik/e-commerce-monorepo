import { NavItem, ProductNavItem } from '../types';

export const adminNavigation: Array<NavItem | ProductNavItem> = [
  {
    title: 'Home',
    href: '/admin',
  },
  {
    title: 'Products',
    href: '/admin/products',
  },
  {
    title: 'Categories',
    href: '/admin/categories',
  },
  {
    title: 'Sales',
    href: '/admin/sales',
  },
];
