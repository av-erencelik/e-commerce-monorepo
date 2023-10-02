import { IGetProductsResponse } from '@client/types/api';
import api from './api';

export const getBreadsProducts = async (searchParams: {
  [key: string]: string | undefined;
}) => {
  const { page, subcategory, sort_by, order } = searchParams ?? {};
  const response = await api.get<IGetProductsResponse>(
    `/product?category_id=1&page=${page ?? 1}${
      subcategory ? `&subcategory_id=${subcategory}` : ''
    }&sort_by=${sort_by ?? 'created_at'}&order=${order ?? 'desc'}`
  );
  return response.data;
};

export const getChocolateProducts = async (searchParams: {
  [key: string]: string | undefined;
}) => {
  const { page, subcategory, sort_by, order } = searchParams ?? {};
  const response = await api.get<IGetProductsResponse>(
    `/product?category_id=2&page=${page ?? 1}${
      subcategory ? `&subcategory_id=${subcategory}` : ''
    }&sort_by=${sort_by ?? 'created_at'}&order=${order ?? 'desc'}`
  );
  return response.data;
};
