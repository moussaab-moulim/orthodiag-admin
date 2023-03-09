import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { ThunkAction } from 'redux-thunk';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { Action } from '@reduxjs/toolkit';
import { authenticationApi } from '@slices/authentication';
import { calendarSlice } from '@slices/calendar';
import { chatSlice } from '@slices/chat';
import { kanbanSlice } from '@slices/kanban';
import { mailSlice } from '@slices/mail';
import { passApi } from '@slices/pass';
import { quizApi } from '@slices/quizReduxApi';
import { createWrapper } from 'next-redux-wrapper';
import { fileApi } from '@slices/fileReduxApi';

export const store = () =>
  configureStore({
    reducer: {
      [authenticationApi.reducerPath]: authenticationApi.reducer,
      [passApi.reducerPath]: passApi.reducer,
      [quizApi.reducerPath]: quizApi.reducer,
      [fileApi.reducerPath]: fileApi.reducer,
      [kanbanSlice.name]: kanbanSlice.reducer,
      [calendarSlice.name]: calendarSlice.reducer,
      [chatSlice.name]: chatSlice.reducer,
      [mailSlice.name]: mailSlice.reducer,
    },
    devTools: process.env.NEXT_PUBLIC_ENABLE_REDUX_DEV_TOOLS === 'true',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authenticationApi.middleware,
        passApi.middleware,
        quizApi.middleware,
        fileApi.middleware
      ),
  });
export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useDispatch: () => AppDispatch = useReduxDispatch;

export const wrapper = createWrapper<AppStore>(store);
