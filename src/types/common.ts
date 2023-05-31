export interface PageParams {
  page?: number;
  limit?: number;
  [param: string]: string | number | boolean | undefined | null;
}

export interface Paginated<T> {
  hasNextPage: boolean;
  totalCount: number;
  data: T[];
}
export interface NestPaginated<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
}
export const paginatedDto = <T>(data: NestPaginated<T>): Paginated<T> => {
  return {
    data: data.data,
    hasNextPage: data.meta.currentPage < data.meta.totalPages,
    totalCount: data.meta.totalItems,
  };
};

export interface Status {
  id: number;
  name: string;
}
