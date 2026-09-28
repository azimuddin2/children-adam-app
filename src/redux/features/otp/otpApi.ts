import { baseApi } from '@/redux/api/baseApi';

const otpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    resendOtp: builder.mutation({
      query: (email: string) => ({
        url: '/otp/resend-otp',
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: ['Otp'],
    }),
    verifyOtp: builder.mutation({
      query: (otpCode) => ({
        url: '/otp/verify-otp',
        method: 'POST',
        body: otpCode,
      }),
      invalidatesTags: ['Otp'],
    }),
  }),
});

export const { useVerifyOtpMutation, useResendOtpMutation } = otpApi;
