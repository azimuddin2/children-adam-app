import { baseApi } from '@/redux/api/baseApi';
import { IUser, TResponse } from '@/types';

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<TResponse<IUser>, string>({
      query: (email) => ({
        url: `/users/profile/${email}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    updateUserProfile: builder.mutation<
      TResponse<IUser>,
      { email: string; body: FormData }
    >({
      query: ({ email, body }) => ({
        url: `/users/profile/${email}`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),

    getUserById: builder.query<TResponse<IUser>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    updateNotificationSettings: builder.mutation<
      TResponse<IUser>,
      { notifications: boolean }
    >({
      query: (body) => ({
        url: `/users/update-notifications`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),

    deleteUserAccount: builder.mutation<TResponse<IUser>, void>({
      query: () => ({
        url: `/users`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserByIdQuery,
  useUpdateNotificationSettingsMutation,
  useDeleteUserAccountMutation,
} = userApi;
