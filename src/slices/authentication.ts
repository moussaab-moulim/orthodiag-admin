import { User } from '@interfaces/user';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { apiConfig } from 'src/config';
interface LoginResponse {
  token: string;
  user: User;
}
export const authenticationApi = createApi({
  reducerPath: 'authenticationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.apiUrl + '/auth',
  }),

  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['auth/me'],
  endpoints: (build) => ({
    adminLogin: build.mutation<
      LoginResponse,
      { email: string; password: string }
    >({
      query({ email, password }) {
        return {
          url: `/admin/email/login`,
          method: 'POST',
          body: {
            email,
            password,
          },
        };
      },
    }),
    me: build.mutation<User, string>({
      query(input) {
        return {
          url: `/me`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${input}`,
          },
        };
      },
    }),
    confirmEmail: build.mutation<void, string>({
      query(hash) {
        return {
          url: `/email/confirm`,
          method: 'POST',
          body: {
            hash,
          },
        };
      },
    }),
    resetPassword: build.mutation<void, { password: string; hash: string }>({
      query({ password, hash }) {
        return {
          url: `/reset/password`,
          method: 'POST',
          body: {
            password,
            hash,
          },
        };
      },
    }),
  }),
});

export const {
  useConfirmEmailMutation,
  useResetPasswordMutation,
  useAdminLoginMutation,
  useMeMutation,
} = authenticationApi;
