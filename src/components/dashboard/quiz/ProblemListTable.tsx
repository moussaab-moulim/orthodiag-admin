import React, { Fragment, useEffect, useState } from 'react';
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
  Popover,
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
import { Image as ImageIcon } from 'src/icons/image';

import { getInitials } from '../../../utils/get-initials';
import { Scrollbar } from '../../scrollbar';
import { Quiz, Problem } from '@interfaces/quiz';
import TableComponentServerPagination from '@components/TableComponentServerPagination';
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
import { useGetProblemesQuery } from '@slices/problemReduxApi';
import { Table5 } from '@components/widgets/tables/table-5';
import Image from 'next/image';

interface ProblemListTableProps {}

export const ProblemListTable: FC<ProblemListTableProps> = (props) => {
  const { ...other } = props;

  const [params, { onFilterChange, onPaginationModelChange, onSortChange }] =
    usePaginatedState();
  const { problemColumns: columns } = useProblemColumns();
  const {
    data: problemsRows,
    isFetching,
    isError,
    error: problemsError,
  } = useGetProblemesQuery(params);

  useErrorHandler(problemsError);

  return (
    <div {...other}>
      <TableComponentServerPagination
        error={problemsError}
        label={'problems'}
        columns={columns}
        rows={problemsRows?.data ?? []}
        loading={isFetching}
        totalRows={problemsRows?.totalCount ?? 0}
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

function useProblemColumns() {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [openedPopoverId, setOpenedPopoverId] = useState<number | null>(null);
  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    id: number
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenedPopoverId(id);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setOpenedPopoverId(null);
  };

  const [anchorEl2, setAnchorEl2] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handlePopoverClose2 = () => {
    setAnchorEl2(null);
  };

  const open2 = Boolean(anchorEl2);

  const problemColumns: GridColDef<Problem>[] = [
    {
      field: 'id',
      headerName: t('id'),
      hideable: true,
      renderCell: (row) => (
        <TableCellWithTooltip value={row.row.id.toString()} />
      ),
      width: 100,
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
      field: 'image',
      headerName: t('Image'),
      hideable: true,
      renderCell: (row) =>
        row.row.images[0] ? (
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'background.default',
              display: 'flex',
              height: 50,
              justifyContent: 'center',
              overflow: 'hidden',
              width: 50,
              '& img': {
                height: 'auto',
                width: '100%',
              },
            }}
            aria-owns={`mouse-over-popover-${row.row.id}`}
            aria-haspopup='true'
            onMouseEnter={(e) => handlePopoverOpen(e, row.row.id)}
            onMouseLeave={handlePopoverClose}
          >
            <Image
              width={250}
              height={250}
              alt='Image of the treatment'
              src={row.row.images[0].path}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
            <Popover
              id={`mouse-over-popover-${row.row.id}`}
              sx={{
                pointerEvents: 'none',
              }}
              open={openedPopoverId === row.row.id}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              {/* row.row.images[0].path */}
              <Image
                width={250}
                height={250}
                alt='Image of the treatment'
                src={row.row.images[0].path}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Popover>
          </Box>
        ) : (
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'background.default',
              display: 'flex',
              height: 50,
              justifyContent: 'center',
              width: 50,
            }}
            aria-owns={open2 ? `mouse-over-popover-${row.row.id}` : undefined}
            aria-haspopup='true'
            onMouseEnter={handlePopoverOpen2}
            onMouseLeave={handlePopoverClose2}
          >
            <ImageIcon fontSize='small' />
            <Popover
              id={`mouse-over-popover-${row.row.id}`}
              sx={{
                pointerEvents: 'none',
              }}
              open={open2}
              anchorEl={anchorEl2}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose2}
              disableRestoreFocus
            >
              {/* row.row.images[0].path */}
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'background.default',
                  display: 'flex',
                  height: 250,
                  justifyContent: 'center',
                  width: 250,
                }}
              >
                {' '}
                <ImageIcon fontSize='medium' />
              </Box>
            </Popover>
          </Box>
        ),
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
      field: 'action',
      headerName: t('Actions'),
      hideable: false,
      type: 'actions',
      flex: 1,
      renderCell: (row) => (
        <IconButton
          href={`problems/${row.row.id}/edit`}
          component='a'
          LinkComponent={NextLink}
        >
          <PencilAltIcon fontSize='small' />
        </IconButton>
      ),
    },
  ];

  return { problemColumns };
}
