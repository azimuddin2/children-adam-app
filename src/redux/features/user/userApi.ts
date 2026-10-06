import { baseApi } from '@/redux/api/baseApi';
import { IUser, TResponse } from '@/types';

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (userInfo) => ({
        url: '/users/signup',
        method: 'POST',
        body: userInfo,
      }),
    }),

    getUserProfile: builder.query<TResponse<IUser>, void>({
      query: () => ({
        url: `/users/profile`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    updateUserProfile: builder.mutation<TResponse<IUser>, { body: FormData }>({
      query: ({ body }) => ({
        url: `/users/profile`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),

    updateUserPicture: builder.mutation<
      TResponse<IUser>,
      FormData
    >({
      query: (formData) => ({
        url: `/users/profile/picture`,
        method: 'PATCH',
        body: formData,
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
  useSignUpMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserPictureMutation,
  useGetUserByIdQuery,
  useUpdateNotificationSettingsMutation,
  useDeleteUserAccountMutation,
} = userApi;