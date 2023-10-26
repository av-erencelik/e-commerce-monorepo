import { Product } from '@client/types/column';
import api from './api';
import {
  IAddProductResponse,
  ICheckPaymentResponse,
  ICreateSaleResponse,
  IEditProductResponse,
  IGenericPostResponse,
  IGetCart,
  IGetCategoriesResponse,
  IGetPreSignedUrlResponse,
  IGetProductsResponse,
  IGetSubcategoryResponse,
} from '@client/types/api';
import {
  CreateSaleData,
  CreateSubcategoryData,
  EditProductData,
  EditSubcategoryData,
} from '@client/types';
import { refreshAccessTokenFn } from './auth-api';
import { UserPayload } from '@e-commerce-monorepo/global-types';

const MAX_RETRY = 3;
let currentRetry = 0;

export const getProduct = async (id: string) => {
  try {
    const response = await api.get<Product>(`/product/${id}`);
    return response.data;
  } catch (error) {
    return undefined;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get<{ user: UserPayload }>('/auth/current-user');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getAllProducts = async (page = 1, subcategoryId?: number) => {
  const url = subcategoryId
    ? `/product?page=${page}&subcategory_id=${subcategoryId}`
    : `/product?page=${page}`;
  const response = await api.get<IGetProductsResponse>(url);
  return response.data;
};

export const getAllProductsIds = async () => {
  const response = await api.get<{
    products: { id: number; name: string }[];
  }>('/product/ids');
  return response.data;
};

export const getSubcategory = async (id: string) => {
  const response = await api.get<IGetSubcategoryResponse>(
    `/product/category/${id}`
  );
  return response.data;
};

export const editProduct = async ({
  productId,
  data,
}: {
  productId: number;
  data: EditProductData;
}) => {
  const response = await api.patch<IEditProductResponse>(
    `/product/update/${productId}`,
    data
  );
  return response.data;
};

export const editSubcategory = async (data: EditSubcategoryData) => {
  const response = await api.patch(`/product/category/${data.id}`, data);
  return response.data;
};

export const createProduct = async (data: EditProductData) => {
  const response = await api.post<IAddProductResponse>('/product/create', data);
  return response.data;
};

export const createSubcategory = async (data: CreateSubcategoryData) => {
  const response = await api.post('/product/category', data);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get<IGetCategoriesResponse>('/product/categories');
  return response.data.categories;
};

export const getPreSignedUrls = async (
  images: { type: string; name: string }[]
) => {
  const response = await api.post<IGetPreSignedUrlResponse>('/product/image', {
    images,
  });
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/product/${id}`);
  return response.data;
};

export const deleteSubcategory = async (id: number) => {
  const response = await api.delete(`/product/category/${id}`);
  return response.data;
};

export const createSale = async ({
  productId,
  data,
}: {
  productId: number;
  data: CreateSaleData;
}) => {
  const response = await api.post<ICreateSaleResponse>(
    `/product/sale/${productId}`,
    data
  );
  return response.data;
};

export const deleteSale = async ({
  saleId,
  productId,
}: {
  saleId: number;
  productId: number;
}) => {
  const response = await api.delete(
    `/product/sale/${productId}?sale_id=${saleId}`
  );
  return response.data;
};

export const addToCart = async ({
  quantity,
  productId,
}: {
  quantity: number;
  productId: number;
}) => {
  const response = await api.post(
    `/shop/cart?product_id=${productId}&quantity=${quantity}`
  );
  return response.data as IGenericPostResponse;
};

export const updateQuantityOfProductInCart = async ({
  quantity,
  productId,
}: {
  quantity: number;
  productId: number;
}) => {
  const response = await api.patch(
    `/shop/cart/${productId}?quantity=${quantity}`
  );
  return response.data as IGenericPostResponse;
};

export const removeFromCart = async (productId: number) => {
  const response = await api.delete(`/shop/cart?product_id=${productId}`);
  return response.data as IGenericPostResponse;
};

export const getCart = async () => {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const errMessage = error.response?.data.message as string;
      if (
        errMessage.includes('Cart does not belong to user') &&
        currentRetry < MAX_RETRY
      ) {
        try {
          const { data } = await refreshAccessTokenFn();
          if (data.message === 'Tokens refreshed successfully') {
            currentRetry = 0;
            return api(originalRequest);
          } else {
            currentRetry++;
          }
        } catch (error) {
          currentRetry++;
        }
      }
      return Promise.reject(error);
    }
  );
  const response = await api.get('/shop/cart');
  return response.data as IGetCart;
};

export const checkPayment = async (paymentIntent: string) => {
  try {
    const response = await api.get<ICheckPaymentResponse>(
      `/shop/order/check?payment_intent=${paymentIntent}`
    );
    return response.data;
  } catch (error) {
    return undefined;
  }
};
