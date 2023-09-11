import {
  EditProductSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  createSubcategorySchema,
  editSubcategorySchema,
  addSaleSchema,
} from '@e-commerce-monorepo/global-types';
import { z } from 'zod';

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

export type ProductImage = {
  url: string;
  key: string;
  isFeatured: boolean;
  id: number;
  productId: number;
  createdAt: Date | null;
};

export type ProductCategory = {
  id: number;
  name: string;
  description: string;
  subCategories: ProductSubCategory[];
};

export type AddedProduct = {
  name: string;
  description: string;
  stock: number;
  weight: number | null;
  categoryId: number;
  id: number;
  version: number;
  dailySales: number;
  createdAt: Date;
};

export type ProductSubCategory = {
  id: number;
  name: string;
  description: string;
  categoryId: number;
};

export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = Z.infer<typeof signupSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type EditProductData = z.infer<typeof EditProductSchema>;
export type CreateSubcategoryData = z.infer<typeof createSubcategorySchema>;
export type EditSubcategoryData = z.infer<typeof editSubcategorySchema>;
export type CreateSaleData = z.infer<typeof addSaleSchema>;
