import {
  GenericResponse,
  IGenericPostResponse,
  IGetUserResponse,
  ILoginResponse,
} from '../../types/api';
import {
  ForgotPasswordData,
  LoginData,
  ResetPasswordData,
  SignupData,
} from '../../types';
import authApi from './auth-api';

export const logoutUserFn = async () => {
  const response = await authApi.post<GenericResponse>('/auth/logout');
  return response.data;
};

export const loginUserFn = async (data: LoginData) => {
  const response = await authApi.post<ILoginResponse>('/auth/login', data);
  return response.data;
};

export const signupUserFn = async (data: SignupData) => {
  const response = await authApi.post<ILoginResponse>('/auth/signup', data);
  return response.data;
};

export const resendVerificationEmailFn = async () => {
  const response = await authApi.put<GenericResponse>('/auth/verify-email');
  return response.data;
};

export const verifyEmailFn = async (token: string) => {
  const response = await authApi.post<GenericResponse>(
    `/auth/verify-email?token=${token}`
  );
  return response.data;
};

export const forgotPasswordFn = async (data: ForgotPasswordData) => {
  const response = await authApi.post<GenericResponse>(
    '/auth/forgot-password',
    data
  );
  return response.data;
};

export const resetPasswordFn = async ({
  data,
  token,
  userId,
}: {
  data: ResetPasswordData;
  token: string;
  userId: string;
}) => {
  const response = await authApi.put<GenericResponse>(
    `/auth/reset-password?token=${token}&id=${userId}`,
    data
  );
  return response.data;
};

export const getUserDetails = async () => {
  const response = await authApi.get<IGetUserResponse>('/auth/get-user');
  return response.data;
};

export const updateUserFn = async (data: {
  fullName: string;
  countryCode: string;
  phoneNumber: string;
}) => {
  const response = await authApi.put<IGenericPostResponse>(
    '/auth/update-user',
    data
  );
  return response.data;
};
