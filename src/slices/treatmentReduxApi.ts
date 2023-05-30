import {
  NestPaginated,
  PageParams,
  Paginated,
  paginatedDto,
} from '@interfaces/common';
import { Answer, FileEntity, Question, Treatment } from '@interfaces/quiz';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { globalHeaders, toQueryParams } from '@utils/helpers';
import { HYDRATE } from 'next-redux-wrapper';
import { apiConfig } from 'src/config';
import deepEqual from 'deep-equal';

// interface UpdateTreatmentNode {
//   id: number;
//   isInlineAnswers?: boolean;
//   question?: {
//     id: number;
//   };
// }

interface UpdateTreatment {
  id: number;
  code: string;

  name: string;

  description?: string | null;

  images?: FileEntity[];
}

// interface CreateTreatmentNode {
//   previousNode: { id: number };
// }

export const treatmentApi = createApi({
  reducerPath: 'treatmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.apiUrl + '/quiz',
    prepareHeaders: globalHeaders,
  }),

  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: [
    'treatment/treatments',
    'quiz/treatment',
    'quiz/treatment/infinite-scroll',
  ],
  endpoints: (build) => ({
    getTreatmentes: build.query<Paginated<Treatment>, PageParams>({
      query: (params: PageParams) =>
        `/treatment${toQueryParams({ ...params })}`,
      //query: (params: PageParams) => `${toQueryParams({ ...params })}`,

      keepUnusedDataFor: 30,
      transformResponse: (value) => {
        return paginatedDto(value as NestPaginated<Treatment>);
      },
      providesTags: (result) => {
        return result
          ? [
              // Provides a tag for each post in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.data.map(({ id }) => ({
                type: 'treatment/treatments' as const,
                id,
              })),
              { type: 'treatment/treatments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'treatment/treatments', id: 'PARTIAL-LIST' }];
      },
    }),
    getTreatment: build.query<Treatment, number>({
      query: (id) => `/treatment/${id}`,
      //query: (params: PageParams) => `${toQueryParams({ ...params })}`,

      keepUnusedDataFor: 30,
      providesTags: (result, err, id) => [
        { type: 'treatment/treatments', id: id },
      ],
    }),
    updateTreatment: build.mutation<void, UpdateTreatment>({
      query: ({ id, ...body }) => {
        return {
          url: `/treatment/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['quiz/treatment', 'quiz/treatment/infinite-scroll'],
    }),

    createTreatment: build.mutation<Treatment, Omit<UpdateTreatment, 'id'>>({
      query: ({ ...body }) => {
        return {
          url: `/treatment`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['quiz/treatment', 'quiz/treatment/infinite-scroll'],
    }),
  }),
});

export const {
  useGetTreatmentesQuery,
  useGetTreatmentQuery,
  useUpdateTreatmentMutation,
  useCreateTreatmentMutation,
} = treatmentApi;
