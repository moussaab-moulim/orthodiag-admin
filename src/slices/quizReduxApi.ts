import {
  NestPaginated,
  PageParams,
  Paginated,
  paginatedDto,
} from '@interfaces/common';
import {
  Answer,
  FileEntity,
  Question,
  Quiz,
  QuizListItem,
  QuizNodeTree,
} from '@interfaces/quiz';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { globalHeaders, toQueryParams } from '@utils/helpers';
import { HYDRATE } from 'next-redux-wrapper';
import { apiConfig } from 'src/config';
import deepEqual from 'deep-equal';
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

interface CreateQuizNode {
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
  tagTypes: ['quiz/quizes', 'quiz/quizNode', 'quiz/question/infinite-scroll'],
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
      providesTags: (result, error, id) => ['quiz/quizNode'],
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
        console.log('update body', body);
        return {
          url: `/quizNode/${id}`,
          method: 'PATCH',
          body,
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

          currentCacheData.hasNextPage = responseData.hasNextPage;
        } else {
          currentCacheData.data.push(...responseData.data);
        }
        currentCacheData.totalCount = responseData.totalCount;
      },
      transformResponse: (value) => {
        console.log('api before transform', value);
        return paginatedDto(value as NestPaginated<Question>);
      },
      forceRefetch({ currentArg, previousArg }) {
        return !deepEqual(currentArg, previousArg);
      },
    }),

    updateQuestion: build.mutation<void, UpdateQuestion>({
      query: ({ id, ...body }) => {
        console.log('update body', body);
        return {
          url: `/question/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['quiz/quizNode', 'quiz/question/infinite-scroll'],
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
} = quizApi;
