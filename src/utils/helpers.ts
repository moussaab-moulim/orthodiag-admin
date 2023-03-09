import { PageParams } from '@interfaces/common';
import { FetchBaseQueryArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';

export const toQueryParams = (params?: PageParams) => {
  if (params) {
    const query = Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null)
      .map((key) => key + '=' + params[key])
      .join('&');
    return query ? `?${query}` : '';
  } else {
    return '';
  }
};

export const globalHeaders: FetchBaseQueryArgs['prepareHeaders'] = (
  headers
) => {
  const token = globalThis.localStorage.getItem('accessToken');
  // If we have a token set in state, let's assume that we should be passing it.
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }
  headers.set('x-custom-lang', 'fr');
  return headers;
};

export function toKebabCase(str: string): string {
  return str
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => '-' + chr)
    .trim();
}
