import { ProductCategory } from '.';

export type Product = {
  id: number;
  name: string;
  description: string;
  stock: number;
  dailySales: number;
  weight?: number;
  createdAt: Date;
  categoryId: number;
  price: {
    id: number;
    version: number;
    productId: number;
    price: number;
    originalPrice: number;
    startDate: Date;
    endDate: Date;
  }[];
  images: {
    url: string;
    key: string;
    isFeatured: boolean;
    id: number;
    productId: number;
    createdAt: Date | null;
  }[];
  category: {
    id: number;
    name: string;
    description: string;
  };
  subCategory: {
    id: number;
    name: string;
    description: string;
    categoryId: number;
  };
};

export type ProductSubcategoryColumn = {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  category: ProductCategory;
};

export type SalesColumn = {
  price: number;
  id: number;
  productId: number;
  startDate: string;
  endDate: string;
  originalPrice: number;
  product: {
    name: string;
    id: number;
  };
};
