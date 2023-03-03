import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiConfig } from 'src/config';
export const authenticationApi = createApi({
  reducerPath: 'authenticationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.apiUrl + '/auth',
  }),

  /* 	extractRehydrationInfo(action, { reducerPath }) {
		if (action.type === HYDRATE) {
			return action.payload[reducerPath]
		}
	}, */
  tagTypes: ['auth/me'],
  endpoints: (build) => ({
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

export const { useConfirmEmailMutation, useResetPasswordMutation } =
  authenticationApi;
