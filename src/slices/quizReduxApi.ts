import {
  NestPaginated,
  PageParams,
  Paginated,
  paginatedDto,
} from '@interfaces/common';
import {
  Answer,
  FileEntity,
  Problem,
  Question,
  Quiz,
  QuizListItem,
  QuizNodeApiItem,
  QuizNodeTree,
  Result,
  Treatment,
  mapQuizNodeTreeApiItem,
} from '@interfaces/quiz';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { globalHeaders, toQueryParams } from '@utils/helpers';
import { HYDRATE } from 'next-redux-wrapper';
import { apiConfig } from 'src/config';
import deepEqual from 'deep-equal';
import { method } from 'lodash';
interface UpdateQuizNode {
  id: number;
  isInlineAnswers?: boolean;
  question?: {
    id: number;
  };
}

interface UpdateQuestion {
  id: number;
  code: string;

  question: string;

  description?: string | null;

  images?: FileEntity[];
}

interface UpdateAnswer {
  id: number;
  label: string;

  icon?: FileEntity;
}

interface UpdateResult {
  id: number;
  answer: Partial<Answer>;

  problem: Partial<Problem>[];

  treatments: Partial<Treatment>[][];
}

interface CreateQuizNode {
  previousNode: { id: number };
}
interface CloneQuizNode {
  id: number;
  previousNode: { id: number };
}

export const quizApi = createApi({
  reducerPath: 'quizApi',
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
    'quiz/quizes',
    'quiz/quizNode',
    'quiz/question/infinite-scroll',
    'quiz/problem',
    'quiz/problem/infinite-scroll',
    'quiz/treatment',
    'quiz/treatment/infinite-scroll',
    'quiz/result',
  ],
  endpoints: (build) => ({
    getQuizes: build.query<Paginated<QuizListItem>, PageParams>({
      query: (params: PageParams) => `/quiz${toQueryParams({ ...params })}`,
      keepUnusedDataFor: 30,
      providesTags: (result) => {
        return result
          ? [
              // Provides a tag for each post in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.data.map(({ id }) => ({
                type: 'quiz/quizes' as const,
                id,
              })),
              { type: 'quiz/quizes', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'quiz/quizes', id: 'PARTIAL-LIST' }];
      },
    }),
    getQuiz: build.query<Quiz, number>({
      query: (id) => `/quiz/${id}`,
      keepUnusedDataFor: 30,
      providesTags: (result, err, id) => [{ type: 'quiz/quizes', id: id }],
    }),
    createQuiz: build.mutation<QuizListItem, { code: string; name: string }>({
      query({ code, name }) {
        return {
          url: `/quiz`,
          method: 'POST',
          body: {
            code,
            name,
          },
        };
      },
      // Invalidates the tag for this Post `id`, as well as the `PARTIAL-LIST` tag,
      // causing the `listPosts` query to re-fetch if a component is subscribed to the query.
      invalidatesTags: [{ type: 'quiz/quizes', id: 'PARTIAL-LIST' }],
    }),

    getQuizNodeTree: build.query<QuizNodeTree, number>({
      query: (id) => `/quizNode/tree/${id}`,
      keepUnusedDataFor: 30,
      providesTags: (result, error, id) => [
        { type: 'quiz/quizNode', id },
        'quiz/quizNode',
      ],
      transformResponse: (returnValue: QuizNodeApiItem) => {
        console.log(
          'mapQuizNodeTreeApiItem(returnValue)',
          mapQuizNodeTreeApiItem(returnValue)
        );
        return mapQuizNodeTreeApiItem(returnValue);
      },
    }),
    createQuizNode: build.mutation<void, CreateQuizNode>({
      query: (body) => {
        return {
          url: `/quizNode`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['quiz/quizNode'],
    }),

    updateQuizNode: build.mutation<void, UpdateQuizNode>({
      query: ({ id, ...body }) => {
        return {
          url: `/quizNode/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['quiz/quizNode'],
    }),

    deleteQuizNode: build.mutation<void, number>({
      query: (id) => {
        return {
          url: `/quizNode/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['quiz/quizNode'],
    }),
    cloneQuizNode: build.mutation<void, CloneQuizNode>({
      query: ({ id, ...body }) => {
        return {
          url: `/quizNode/clone/${id}`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: ['quiz/quizNode'],
    }),

    createQuizAnswer: build.mutation<Answer, number>({
      query(parentQuizNodeId) {
        return {
          url: `/answer`,
          method: 'POST',
          body: {
            parentQuizNode: parentQuizNodeId,
          },
        };
      },
      invalidatesTags: ['quiz/quizNode'],
    }),

    updateAnswer: build.mutation<void, UpdateAnswer>({
      query: ({ id, ...body }) => {
        return {
          url: `/answer/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['quiz/quizNode'],
    }),

    deleteAnswer: build.mutation<void, number>({
      query: (id) => {
        return {
          url: `/answer/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['quiz/quizNode'],
    }),

    getQuestionsInfiniteScroll: build.query<Paginated<Question>, PageParams>({
      query: (params: PageParams) =>
        `/question${toQueryParams({
          ...params,
          merge: undefined,
        })}`,
      keepUnusedDataFor: 30,
      providesTags: ['quiz/question/infinite-scroll'],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCacheData, responseData, otherArgs) => {
        if (otherArgs.arg['merge'] === false) {
          currentCacheData.data = responseData.data;
        } else {
          currentCacheData.data.push(...responseData.data);
        }
        currentCacheData.hasNextPage = responseData.hasNextPage;
        currentCacheData.totalCount = responseData.totalCount;
      },
      transformResponse: (value) => {
        return paginatedDto(value as NestPaginated<Question>);
      },
      forceRefetch({ currentArg, previousArg }) {
        return !deepEqual(currentArg, previousArg);
      },
    }),

    updateQuestion: build.mutation<void, UpdateQuestion>({
      query: ({ id, ...body }) => {
        return {
          url: `/question/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['quiz/quizNode', 'quiz/question/infinite-scroll'],
    }),

    getProblemsInfiniteScroll: build.query<Paginated<Problem>, PageParams>({
      query: (params: PageParams) =>
        `/problem${toQueryParams({
          ...params,
          merge: undefined,
        })}`,
      keepUnusedDataFor: 30,
      providesTags: ['quiz/problem/infinite-scroll'],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCacheData, responseData, otherArgs) => {
        if (otherArgs.arg['merge'] === false) {
          currentCacheData.data = responseData.data;
        } else {
          currentCacheData.data.push(...responseData.data);
        }
        currentCacheData.hasNextPage = responseData.hasNextPage;
        currentCacheData.totalCount = responseData.totalCount;
      },
      transformResponse: (value) => {
        return paginatedDto(value as NestPaginated<Problem>);
      },
      forceRefetch({ currentArg, previousArg }) {
        return !deepEqual(currentArg, previousArg);
      },
    }),

    getTreatmentsInfiniteScroll: build.query<Paginated<Treatment>, PageParams>({
      query: (params: PageParams) =>
        `/treatment${toQueryParams({
          ...params,
          merge: undefined,
        })}`,
      keepUnusedDataFor: 30,
      providesTags: ['quiz/treatment/infinite-scroll'],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCacheData, responseData, otherArgs) => {
        if (otherArgs.arg['merge'] === false) {
          currentCacheData.data = responseData.data;
        } else {
          currentCacheData.data.push(...responseData.data);
        }
        currentCacheData.hasNextPage = responseData.hasNextPage;
        currentCacheData.totalCount = responseData.totalCount;
      },
      transformResponse: (value) => {
        return paginatedDto(value as NestPaginated<Treatment>);
      },
      forceRefetch({ currentArg, previousArg }) {
        return !deepEqual(currentArg, previousArg);
      },
    }),
    getQuizResult: build.query<Result, number>({
      query: (id) => `/result/${id}`,
      keepUnusedDataFor: 30,
      providesTags: (result, err, id) => [{ type: 'quiz/result', id: id }],
    }),

    updateQuizResult: build.mutation<void, UpdateResult>({
      query: ({ id, ...body }) => {
        return {
          url: `/result/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: (result, error, args) => {
        return result ? [{ type: 'quiz/result', id: args.id }] : [];
      },
    }),
  }),
});

export const {
  useGetQuizesQuery,
  useCreateQuizMutation,
  useGetQuizQuery,
  useGetQuizNodeTreeQuery,
  useCreateQuizAnswerMutation,
  useUpdateQuizNodeMutation,
  useCreateQuizNodeMutation,
  useGetQuestionsInfiniteScrollQuery,
  useUpdateQuestionMutation,
  useUpdateAnswerMutation,
  useGetProblemsInfiniteScrollQuery,
  useGetTreatmentsInfiniteScrollQuery,
  useUpdateQuizResultMutation,
  useGetQuizResultQuery,
  useDeleteAnswerMutation,
  useDeleteQuizNodeMutation,
  useCloneQuizNodeMutation,
} = quizApi;
