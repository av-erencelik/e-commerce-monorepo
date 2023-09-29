import { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  name: 'Sourdough',
  icon: '/icon.png',
  description: 'Homemade Breads & Artisanal Chocolates',
  github: 'https://github.com/av-erencelik/e-commerce-monorepo',
};

export const footerNav = [
  {
    title: 'Credits',
    items: [
      {
        title: 'Taxonomy',
        href: 'https://tx.shadcn.com/',
        external: true,
      },
      {
        title: 'Skateshop',
        href: 'https://skateshop.sadmn.com/',
        external: true,
      },
      {
        title: 'shadcn/ui',
        href: 'https://ui.shadcn.com',
        external: true,
      },
    ],
  },
  {
    title: 'Help',
    items: [
      {
        title: 'About',
        href: '/about',
        external: false,
      },
      {
        title: 'Contact',
        href: '/contact',
        external: false,
      },
    ],
  },
  {
    title: 'Social',
    items: [
      {
        title: 'GitHub',
        href: 'https://github.com/av-erencelik',
        external: true,
      },
      {
        title: 'Twitter',
        href: 'https://twitter.com/m_eren_celik',
        external: true,
      },
      {
        title: 'LinkedIn',
        href: 'https://www.linkedin.com/in/av-erencelik/',
        external: true,
      },
      {
        title: 'Discord',
        href: 'https://discord.com/users/497375000492507136',
        external: true,
      },
    ],
  },
  {
    title: 'Other',
    items: [
      {
        title: 'erencelik.dev',
        href: 'https://erencelik.dev/',
        external: true,
      },
      {
        title: 'Sevdem',
        href: 'https://sevdem-monorepo-admin.vercel.app/',
        external: true,
      },
      {
        title: 'Imdb-c',
        href: 'https://imdb-c.vercel.app/home',
        external: true,
      },
      {
        title: 'Twitter-clone',
        href: 'https://twitato.vercel.app/',
        external: true,
      },
    ],
  },
];
