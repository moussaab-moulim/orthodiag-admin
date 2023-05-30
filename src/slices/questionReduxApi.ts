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

//   interface UpdateProblemNode {
//     id: number;
//     isInlineAnswers?: boolean;
//     question?: {
//       id: number;
//     };
//   }

interface UpdateQuestion {
  id: number;
  code: string;

  question: string;

  description?: string | null;

  images?: FileEntity[];
}

//   interface CreateProblemNode {
//     previousNode: { id: number };
//   }

export const questionApi = createApi({
  reducerPath: 'questionApi',
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
    'question/questions',
    'quiz/question',
    'quiz/question/infinite-scroll',
  ],

  endpoints: (build) => ({
    getQuestions: build.query<Paginated<Question>, PageParams>({
      query: (params: PageParams) => `/question${toQueryParams({ ...params })}`,
      //query: (params: PageParams) => `${toQueryParams({ ...params })}`,

      keepUnusedDataFor: 30,
      transformResponse: (value) => {
        return paginatedDto(value as NestPaginated<Question>);
      },
      providesTags: (result) => {
        return result
          ? [
              // Provides a tag for each post in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.data.map(({ id }) => ({
                type: 'question/questions' as const,
                id,
              })),
              { type: 'question/questions', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'question/questions', id: 'PARTIAL-LIST' }];
      },
    }),
    getQuestion: build.query<Question, number>({
      query: (id) => `/question/${id}`,
      //query: (params: PageParams) => `${toQueryParams({ ...params })}`,
      keepUnusedDataFor: 30,
      providesTags: (result, err, id) => [
        { type: 'question/questions', id: id },
      ],
    }),
    updateQuestion: build.mutation<void, UpdateQuestion>({
      query: ({ id, ...body }) => {
        return {
          url: `/question/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['quiz/question', 'quiz/question/infinite-scroll'],
    }),
  }),
});

export const { useGetQuestionsQuery, useGetQuestionQuery } = questionApi;
