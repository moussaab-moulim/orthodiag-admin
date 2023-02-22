import { PageParams } from '@interfaces/common';

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
