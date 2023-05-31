import { PageParams } from '@interfaces/common';
import {
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { backendFilterOperators, defaultPageOptions } from '@utils/constants';
import { useState } from 'react';

export const usePaginatedState = (initalParams?: PageParams) => {
  const [pageParams, setPageParams] = useState<PageParams>(
    initalParams ?? defaultPageOptions
  );

  const onPaginationModelChange = (model: GridPaginationModel) => {
    setPageParams({
      ...pageParams,
      page: model.page + 1,
      limit: model.pageSize,
    });
  };

  // filtering =========
  const onFilterChange = (filterModel: GridFilterModel) => {
    //keeping order param if there was any
    const oldOrderParam =
      Object.keys(pageParams).find((_key) => _key.includes('order')) ?? '';

    //getting key form column name and removing [] if it exists in the column name (TODO: handle multi filters on same column by re adding the [] after the operation)
    const filterKey = filterModel.items[0]
      ? `${filterModel.items[0].field.split('[')[0]}[${
          backendFilterOperators[filterModel.items[0].operator!]
        }]`
      : '';

    //generate the new params
    const newParams = {
      page: pageParams.page,
      itemsPerPage: pageParams.itemsPerPage,
      [filterKey]: filterModel.items[0]
        ? filterModel.items[0].value
        : undefined,
      ...(oldOrderParam ? { [oldOrderParam]: pageParams[oldOrderParam] } : {}),
    };
    setPageParams(newParams);
  };

  // order ==========
  const onSortChange = (sortModel: GridSortModel) => {
    const oldOrderParam =
      Object.keys(pageParams).find((_key) => _key.includes('order')) ?? '';
    if (oldOrderParam) {
      delete pageParams[oldOrderParam];
    }
    //getting key form column name and removing [] if it exists in the column name (TODO: handle multi filters on same column by re adding the [] after the operation)
    const orderKey = `order[${sortModel[0]?.field.split('[')[0]}]`;

    const newParams = {
      ...pageParams,
      [orderKey]: sortModel[0]?.sort ?? undefined,
    };
    setPageParams(newParams);
  };
  const onSelectLoadMore = () => {
    setPageParams((prev) => ({
      ...prev,
      page: Number(prev.page) + 1,
      //merge param is for redux query to decide if we want to replace old results or just add new reslut ot old one
      merge: true,
    }));
  };
  const onSelectSearch = (text: string, filterParam: string) => {
    setPageParams((prev) => ({
      ...prev,
      page: 1,
      merge: false,
      [filterParam]: text,
    }));
  };

  const actions = {
    onFilterChange,
    onSortChange,
    onPaginationModelChange,

    onSelectLoadMore,
    onSelectSearch,
    setPageParams,
  };

  return [pageParams, actions] as [PageParams, typeof actions];
};
