import React, { useState } from 'react';
import type { FC } from 'react';
import NextLink from 'next/link';
import { Box, IconButton, Popover } from '@mui/material';
import { PencilAlt as PencilAltIcon } from '../../../icons/pencil-alt';
import { Image as ImageIcon } from 'src/icons/image';
import TableComponentServerPagination from '@components/TableComponentServerPagination';
import { usePaginatedState } from '@hooks/usePaginatedState';
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import { TableCellWithTooltip } from '@components/TableCellWithTooltip';
import { defaultFilterOperators } from '@utils/constants';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';
import { useGetPracticesQuery } from '@slices/practiceReduxApi';
import Image from 'next/image';
import { Practice } from '@interfaces/Practices';

interface PracticeListTableProps {}

export const PracticeListTable: FC<PracticeListTableProps> = (props) => {
  const { ...other } = props;

  const [params, { onFilterChange, onPaginationModelChange, onSortChange }] =
    usePaginatedState();
  const { practiceColumns: columns } = usePracticeColumns();
  const {
    data: practicesRows,
    isFetching,
    isError,
    error: practicesError,
  } = useGetPracticesQuery(params);

  useErrorHandler(practicesError);

  return (
    <div {...other}>
      <TableComponentServerPagination
        error={practicesError}
        label={'practices'}
        columns={columns}
        rows={practicesRows?.data ?? []}
        loading={isFetching}
        totalRows={practicesRows?.totalCount ?? 0}
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

function usePracticeColumns() {
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

  const practiceColumns: GridColDef<Practice>[] = [
    {
      field: 'id',
      headerName: t('id'),
      hideable: true,
      renderCell: (row) => (
        <TableCellWithTooltip value={row.row.id.toString()} />
      ),
      width: 50,
    },

    {
      field: 'image',
      headerName: t('Image'),
      hideable: true,
      renderCell: (row) =>
        row.row.image ? (
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
              alt='Image of the practice'
              src={row.row.image.path}
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
                unoptimized
                width={250}
                height={250}
                alt='Image of the practice'
                src={row.row.image.path}
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
      flex: 2,
      filterOperators: defaultFilterOperators,
      // sortable: false,
    },

    {
      field: 'city',
      headerName: t('City'),
      hideable: true,
      renderCell: (row) => <TableCellWithTooltip value={row.row.city} />,
      flex: 1,
      filterOperators: defaultFilterOperators,
      // sortable: false,
    },
    {
      field: 'address',
      headerName: t('Address'),
      hideable: true,
      renderCell: (row) => <TableCellWithTooltip value={row.row.address} />,
      flex: 2,
      filterOperators: defaultFilterOperators,
      // sortable: false,
    },
    {
      field: 'latitude',
      headerName: t('Latitude'),
      hideable: true,
      renderCell: (row) => (
        <TableCellWithTooltip value={row.row.latitude.toString()} />
      ),
      flex: 1,
      filterOperators: defaultFilterOperators,
      // sortable: false,
    },
    {
      field: 'longitude',
      headerName: t('Longitude'),
      hideable: true,
      renderCell: (row) => (
        <TableCellWithTooltip value={row.row.longitude.toString()} />
      ),
      flex: 1,
      filterOperators: defaultFilterOperators,
      // sortable: false,
    },
    {
      field: 'rating',
      headerName: t('Rating'),
      hideable: true,
      renderCell: (row) => (
        <TableCellWithTooltip value={row.row.rating.toString()} />
      ),
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
          component='a'
          LinkComponent={NextLink}
          href={`practices/${row.row.id}/edit`}
        >
          <PencilAltIcon fontSize='small' />
        </IconButton>
      ),
    },
  ];

  return { practiceColumns };
}
