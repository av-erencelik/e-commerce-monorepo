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
  github: string;
};

export interface NavItem {
  title: string;
  href: string;
}

export interface AboutCredits extends NavItem {
  description: string;
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

export type CartItem = {
  quantity: number;
  id: number;
  cartId: string;
  productId: number;
  product: {
    id: number;
    name: string;
    version: number;
    stock: number;
    createdAt: Date;
    image: string;
    price: ProductPrice[];
  };
};

export type Product = {
  id: number;
  name: string;
  version: number;
  stock: number;
  createdAt: Date;
  image: string;
  productPrice: ProductPrice[];
};

export type ProductPrice = {
  id: number;
  productId: number;
  price: number;
  startDate: Date;
  endDate: Date;
};

export type Order = {
  status: 'pending' | 'paid' | 'not confirmed';
  id: string;
  createdAt: Datel;
  userId: string;
  updatedAt: Date;
  totalAmount: number;
  paymentIntentId: string | null;
  clientSecret: string | null;
  orderItem: OrderItem[];
};

export type OrderItem = {
  id: number;
  orderId: string;
  productId: number;
  quantity: number;
  price: number;
  image: string;
  productName: string;
};

export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = Z.infer<typeof signupSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type EditProductData = z.infer<typeof EditProductSchema>;
export type CreateSubcategoryData = z.infer<typeof createSubcategorySchema>;
export type EditSubcategoryData = z.infer<typeof editSubcategorySchema>;
export type CreateSaleData = z.infer<typeof addSaleSchema>;
