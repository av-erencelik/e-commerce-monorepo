import { UserPayload } from '@e-commerce-monorepo/global-types';

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

type GenericResponse = {
  message: string;
};

type ILoginResponse = {
  user: UserPayload;
};
