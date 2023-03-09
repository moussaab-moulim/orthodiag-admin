import { Fragment, useEffect, useState } from 'react';
import type { ChangeEvent, FC, MouseEvent } from 'react';
import NextLink from 'next/link';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import { PencilAlt as PencilAltIcon } from '../../../icons/pencil-alt';

import { getInitials } from '../../../utils/get-initials';
import { Scrollbar } from '../../scrollbar';
import { Quiz, QuizListItem } from '@interfaces/quiz';
import TableComponentServerPagination from '@components/TableComponentServerPagination';
import { useGetQuizesQuery } from '@slices/quizReduxApi';
import { usePaginatedState } from '@hooks/usePaginatedState';
import { useTranslation } from 'react-i18next';
import { useCommon } from '@hooks/useCommon';
import { useRouter } from 'next/router';
import {
  GridColDef,
  GridColumnVisibilityModel,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { TableCellWithTooltip } from '@components/TableCellWithTooltip';
import {
  defaultFilterOperators,
  defaultDateFilterOperators,
} from '@utils/constants';
import State from '@components/State';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';
import { TableErrorComponent } from '@components/ErroComponents';

interface QuizListTableProps {}

export const QuizListTable: FC<QuizListTableProps> = (props) => {
  const { ...other } = props;

  const [params, { onFilterChange, onPaginationModelChange, onSortChange }] =
    usePaginatedState();
  const { quizColumns: columns } = useQuizColumns();
  const {
    data: quizesRows,
    isFetching,
    isError,
    error: quizesError,
  } = useGetQuizesQuery(params);

  useErrorHandler(quizesError);

  return (
    <div {...other}>
      <TableComponentServerPagination
        error={quizesError}
        label={'quizes'}
        columns={columns}
        rows={quizesRows?.data ?? []}
        loading={isFetching}
        totalRows={quizesRows?.totalCount ?? 0}
        page={params.page!}
        pageSize={params.limit!}
        //hideColumns={offersColumnsModel}
        // initialFilter={getFilterParamModel(params, columns)}
        // initialSort={getSortingParamModel(params)}
        //onFilterChange={(model) => onFilterChange(model)}
        //onSortChange={(model) => onSortChange(model)}
        onPaginationModelChange={onPaginationModelChange}
      />
    </div>
  );
};

function useQuizColumns() {
  const { t } = useTranslation();

  const quizColumns: GridColDef<QuizListItem>[] = [
    {
      field: 'id',
      headerName: t('id'),
      hideable: true,
      renderCell: (row) => (
        <TableCellWithTooltip value={row.row.id.toString()} />
      ),
      width: 56,
    },

    {
      field: 'code',
      headerName: t('Code'),
      hideable: true,
      renderCell: (row) => <TableCellWithTooltip value={row.row.code} />,
      flex: 1,
      filterOperators: defaultFilterOperators,
      // sortable: false,
    },

    {
      field: 'name',
      headerName: t('Name'),
      hideable: true,
      renderCell: (row) => <TableCellWithTooltip value={row.row.name} />,
      flex: 1,
      filterOperators: defaultFilterOperators,
      // sortable: false,
    },

    {
      field: 'status',
      headerName: t('Status'),
      hideable: true,
      renderCell: (row) => (
        <Fragment>
          <State label={row.row.status.name} textSx={{ textAlign: 'center' }} />
        </Fragment>
      ),
      flex: 1,
      filterOperators: defaultFilterOperators,
    },
    {
      field: 'action',
      headerName: t('Actions'),
      hideable: false,
      type: 'actions',
      flex: 1,
      renderCell: (row) => (
        <NextLink href={`quizes/${row.row.id}/edit`} passHref>
          <IconButton component='a'>
            <PencilAltIcon fontSize='small' />
          </IconButton>
        </NextLink>
      ),
    },
  ];

  return { quizColumns };
}
