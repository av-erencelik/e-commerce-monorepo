import { Product } from '@client/types/column';
import api from './api';
import {
  IAddProductResponse,
  ICreateSaleResponse,
  IEditProductResponse,
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

export const getProduct = async (id: string) => {
  const response = await api.get<Product>(`/product/${id}`);
  return response.data;
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
