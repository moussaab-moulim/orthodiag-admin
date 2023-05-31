import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { apiConfig } from 'src/config';
export const passApi = createApi({
  reducerPath: 'passApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.apiUrl + '/passes',
  }),

  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['passes'],
  endpoints: (build) => ({
    setPaid: build.mutation<void, string>({
      query(hash) {
        return {
          url: `/pay/${hash}`,
          method: 'PATCH',
        };
      },
    }),
  }),
});

export const { useSetPaidMutation } = passApi;
