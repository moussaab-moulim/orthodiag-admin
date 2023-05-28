import {
  NestPaginated,
  PageParams,
  Paginated,
  paginatedDto,
} from '@interfaces/common';
import { Answer, FileEntity, Question, Problem } from '@interfaces/quiz';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { globalHeaders, toQueryParams } from '@utils/helpers';
import { HYDRATE } from 'next-redux-wrapper';
import { apiConfig } from 'src/config';
import deepEqual from 'deep-equal';

// interface UpdateProblemNode {
//   id: number;
//   isInlineAnswers?: boolean;
//   question?: {
//     id: number;
//   };
// }

interface UpdateProblem {
  id: number;
  code: string;

  name: string;

  description?: string | null;

  images?: FileEntity[];
}

export const problemApi = createApi({
  reducerPath: 'problemApi',
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
    'problem/problems',
    'quiz/problem',
    'quiz/problem/infinite-scroll',
  ],
  endpoints: (build) => ({
    getProblemes: build.query<Paginated<Problem>, PageParams>({
      query: (params: PageParams) => `/problem${toQueryParams({ ...params })}`,
      //query: (params: PageParams) => `${toQueryParams({ ...params })}`,

      keepUnusedDataFor: 30,
      transformResponse: (value) => {
        return paginatedDto(value as NestPaginated<Problem>);
      },
      providesTags: (result) => {
        return result
          ? [
              // Provides a tag for each post in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.data.map(({ id }) => ({
                type: 'problem/problems' as const,
                id,
              })),
              { type: 'problem/problems', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'problem/problems', id: 'PARTIAL-LIST' }];
      },
    }),
    getProblem: build.query<Problem, number>({
      query: (id) => `/problem/${id}`,
      //query: (params: PageParams) => `${toQueryParams({ ...params })}`,

      keepUnusedDataFor: 30,
      providesTags: (result, err, id) => [{ type: 'problem/problems', id: id }],
    }),
    updateProblem: build.mutation<void, UpdateProblem>({
      query: ({ id, ...body }) => {
        console.log('update body', body);
        return {
          url: `/problem/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['quiz/problem', 'quiz/problem/infinite-scroll'],
    }),
  }),
});

export const {
  useGetProblemesQuery,
  useGetProblemQuery,
  useUpdateProblemMutation,
} = problemApi;
