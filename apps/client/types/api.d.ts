import { UserPayload } from '@e-commerce-monorepo/global-types';
import { AddedProduct, ProductCategory, ProductSubCategory } from '.';
import { Product } from './column';
import { CartState } from '@client/stores/cart-state';

type IApiError = {
  errors?:
    | {
        message: string;
        path: string | number;
      }[]
    | undefined;
  stack?: string | undefined;
  code: number;
  message: string;
};

interface GenericResponse {
  message: string;
}

type ILoginResponse = {
  user: UserPayload;
};

interface IEditProductResponse extends GenericResponse {
  product: number;
}

interface IAddProductResponse extends GenericResponse {
  product: AddedProduct;
}

type IGetCategoriesResponse = {
  categories: ProductCategory[];
};

type IGetPreSignedUrlResponse = {
  images: {
    url: string;
    key: string;
  }[];
};

type IGetSubcategoryResponse = {
  subcategory: ProductSubCategory & {
    category: {
      id: number;
      name: string;
      description: string;
    };
  };
};

type IGetProductsResponse = {
  products: Product[];
  totalCount: number;
};

type ICreateSaleResponse = {
  message: string;
  product: number;
};

type IGetCart = {
  cart: CartState['cart'];
  message: string;
  statusCode: number;
};

type IGenericPostResponse = {
  message: string;
  statusCode: number;
};

type IGetUserResponse = {
  user: {
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
  };
};
