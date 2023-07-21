import {
  NestPaginated,
  PageParams,
  Paginated,
  paginatedDto,
} from '@interfaces/common';
import { Answer, FileEntity, Question } from '@interfaces/quiz';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { globalHeaders, toQueryParams } from '@utils/helpers';
import { HYDRATE } from 'next-redux-wrapper';
import { apiConfig } from 'src/config';
import deepEqual from 'deep-equal';
import { Practice } from '@interfaces/Practices';

interface UpdatePractice {
  id: number;
  address?: string;
  city?: string;
  image?: FileEntity | null;
  latitude?: number;
  longitude?: number;
  name: string;
  rating?: number;
}

export const practiceApi = createApi({
  reducerPath: 'practiceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.apiUrl + '',
    prepareHeaders: globalHeaders,
  }),

  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['practice/practices', 'practice', 'practice/infinite-scroll'],
  endpoints: (build) => ({
    getPractices: build.query<Paginated<Practice>, PageParams>({
      query: (params: PageParams) =>
        `/practices${toQueryParams({ ...params })}`,
      keepUnusedDataFor: 30,
      transformResponse: (value) => {
        console.log(value);
        return paginatedDto(value as NestPaginated<Practice>);
      },
      providesTags: (result) => {
        return result
          ? [
              // Provides a tag for each post in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.data.map(({ id }) => ({
                type: 'practice/practices' as const,
                id,
              })),
              { type: 'practice/practices', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'practice/practices', id: 'PARTIAL-LIST' }];
      },
    }),
    getPractice: build.query<Practice, number>({
      query: (id) => `/practices/${id}`,
      keepUnusedDataFor: 30,
      providesTags: (result, err, id) => [
        { type: 'practice/practices', id: id },
      ],
    }),
    updatePractice: build.mutation<void, UpdatePractice>({
      query: ({ id, ...body }) => {
        return {
          url: `/practices/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['practice', 'practice/infinite-scroll'],
    }),

    createPractice: build.mutation<Practice, Omit<UpdatePractice, 'id'>>({
      query: ({ ...body }) => {
        return {
          url: `/practices`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['practice', 'practice/infinite-scroll'],
    }),
  }),
});

export const {
  useGetPracticesQuery,
  useGetPracticeQuery,
  useUpdatePracticeMutation,
  useCreatePracticeMutation,
} = practiceApi;
