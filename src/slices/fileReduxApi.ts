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

interface CreateQuizNode {
  previousNode: { id: number };
}

export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.apiUrl + '/files',
    prepareHeaders: globalHeaders,
  }),

  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['files', 'files/infinite-scroll'],
  endpoints: (build) => ({
    getFiles: build.query<Paginated<FileEntity>, PageParams>({
      query: (params: PageParams) => `${toQueryParams({ ...params })}`,
      keepUnusedDataFor: 30,
      providesTags: (result) => {
        return result
          ? [
              // Provides a tag for each post in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.data.map(({ id }) => ({
                type: 'files' as const,
                id,
              })),
              { type: 'files', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'files', id: 'PARTIAL-LIST' }];
      },
    }),

    getFilesInfiniteScroll: build.query<Paginated<FileEntity>, PageParams>({
      query: (params: PageParams) =>
        `${toQueryParams({
          ...params,
          merge: undefined,
        })}`,
      keepUnusedDataFor: 30,
      providesTags: ['files/infinite-scroll'],
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
        return paginatedDto(value as NestPaginated<FileEntity>);
      },
      forceRefetch({ currentArg, previousArg }) {
        return !deepEqual(currentArg, previousArg);
      },
    }),
  }),
});

export const { useGetFilesInfiniteScrollQuery, useGetFilesQuery } = fileApi;
