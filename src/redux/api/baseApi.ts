import { TResponse } from '@/types';
import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner-native';
import { logout, setUser, TUser } from '../features/auth/authSlice';
import { RootState } from '../store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token;

    if (token) {
      headers.set('authorization', token);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = (await baseQuery(args, api, extraOptions)) as TResponse<TUser>;

  if (result.error?.status === 404) {
    toast.error(result.error.data?.message ?? 'Not found');
  }

  if (result.error?.status === 401) {
    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await res.json();

    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth?.user;

      api.dispatch(
        setUser({
          user,
          token: data.data.accessToken,
        })
      );

      result = (await baseQuery(args, api, extraOptions)) as TResponse<TUser>;
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['User', 'Auth', 'Otp', 'Support'],
  endpoints: () => ({}),
});
