import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ConfigureStoreOptions,
} from '@reduxjs/toolkit';
import { ThunkMiddlewareFor } from '@reduxjs/toolkit/dist/getDefaultMiddleware';
import { authenticationApi } from '@slices/authentication';
import { passApi } from '@slices/pass';

import { calendarSlice, reducer as calendarReducer } from '../slices/calendar';
import { chatSlice, reducer as chatReducer } from '../slices/chat';
import { kanbanSlice, reducer as kanbanReducer } from '../slices/kanban';
import { mailSlice, reducer as mailReducer } from '../slices/mail';

//add your redux query api here
const rootApis = [authenticationApi, passApi];
//add your redux slice here
const rootslices = [kanbanSlice, calendarSlice, chatSlice, mailSlice];

//do not edit the following code
const slicesReducers = rootslices.reduce(
  (prev, next) => ({ ...prev, [next.name]: next.reducer }),
  {}
);
const apisReducers = rootApis.reduce(
  (prev, next) => ({ ...prev, [next.reducerPath]: next.reducer }),
  {}
);

export const rootReducers = { ...slicesReducers, ...apisReducers };
export const rootMiddlewares = rootApis.map((_api) => _api.middleware);
