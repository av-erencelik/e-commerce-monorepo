import { loginSchema, signupSchema } from '@e-commerce-monorepo/global-types';

export type SiteConfig = {
  name: string;
  icon: string;
  description: string;
};

export interface NavItem {
  title: string;
  href: string;
}

export interface ProductNavItem extends NavItem {
  isCategory: boolean;
  categories: Category[];
}

export type Category = {
  title: string;
  href: string;
  description: string;
  image: string;
  alt: string;
};

export type Image = {
  src: string;
  alt: string;
};

export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = Z.infer<typeof signupSchema>;
