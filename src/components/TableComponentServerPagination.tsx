import {
  DataGrid,
  frFR,
  enUS,
  GridRowsProp,
  GridFilterModel,
  GridSortModel,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
  GridToolbar,
  GridDensity,
  GridColDef,
  GridPaginationModel,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { DataGridPropsWithoutDefaultValue } from '@mui/x-data-grid/models/props/DataGridProps';
import { LinearProgress, SxProps } from '@mui/material';
import { TableLoadingComponent } from './TableLoadingComponent';
import { Fragment, useCallback, useMemo } from 'react';
import { useCommon } from '@hooks/useCommon';
import { defaultPageSizeOptions } from '@utils/constants';
import { ErrorBoundary } from 'react-error-boundary';
import { TableErrorComponent } from './ErroComponents';

interface ITableProps {
  label: string;
  columns: GridColDef[];
  rows: GridRowsProp;
  pagination?: number[];
  checkbox?: boolean;
  autoHeight?: boolean;
  subTable?: boolean;
  sx?: SxProps;
  totalRows: number;
  page?: number;
  pageSize?: number;
  loading?: boolean;
  error?: any;
  hideColumns?: DataGridPropsWithoutDefaultValue['columnVisibilityModel'];
  disableColumnSelector?: boolean;
  showTableMenu?: boolean;
  initialFilter?: GridFilterModel;
  initialSort?: GridSortModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onFilterChange?: (model: GridFilterModel) => void;
  onSortChange?: (model: GridSortModel) => void;
  disableColumnMenu?: boolean;
  density?: GridDensity;
}

const TableComponentServerPagination = ({
  label,
  columns,
  rows,
  pagination = defaultPageSizeOptions,
  checkbox = true,
  autoHeight = true,
  subTable,
  sx,
  totalRows,
  page,
  pageSize,
  loading,
  error,
  hideColumns,
  disableColumnSelector = false,
  showTableMenu = true,
  initialFilter,
  initialSort,
  disableColumnMenu = false,
  onPaginationModelChange,
  onFilterChange,
  onSortChange,
  density = 'standard',
}: ITableProps): JSX.Element => {
  const max_columns = 13; //This prop allows to render more than 2 columns while testing the component
  const gridHeight = autoHeight ? 'auto' : 455;
  const paginationModel = useMemo(
    () => ({
      page: page ?? 0,
      pageSize: pageSize ?? 50,
    }),
    [page, pageSize]
  );

  const LoadingCompopent = useCallback(
    () => (
      <Fragment>
        <LinearProgress />
        <TableLoadingComponent lines={50} />
      </Fragment>
    ),
    []
  );
  const { locale } = useCommon();

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    onPaginationModelChange(model);
  };
  return (
    <Box sx={{ height: gridHeight, width: '100%', mb: 3 }}>
      <DataGrid
        density={density}
        components={{
          Toolbar: showTableMenu ? GridToolbar : undefined,
          LoadingOverlay: LoadingCompopent,
        }}
        componentsProps={{
          toolbar: {
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
        disableColumnMenu={disableColumnMenu}
        autoHeight={autoHeight}
        checkboxSelection={checkbox ? true : false}
        localeText={
          locale === 'fr'
            ? frFR.components.MuiDataGrid.defaultProps.localeText
            : enUS.components.MuiDataGrid.defaultProps.localeText
        }
        disableColumnSelector={disableColumnSelector}
        rows={rows}
        rowCount={totalRows}
        columns={columns}
        aria-label={label}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={pagination}
        columnBuffer={max_columns}
        initialState={{
          columns: {
            columnVisibilityModel: hideColumns,
          },
          filter: {
            filterModel: initialFilter,
          },
          sorting: { sortModel: initialSort },
        }}
        sx={{
          boxShadow: subTable ? 0 : 4,
          borderStyle: subTable ? 'none' : '1px solid rgba(224, 224, 224, 1)',
          '& .MuiSvgIcon-root:hover': {
            color: 'primary.main',
            cursor: 'pointer',
          },
          '& .MuiDataGrid-row': {
            maxHeight: '300px !important',
          },
          '& .MuiDataGrid-cell': {
            maxHeight: '300px !important',
            borderBottomStyle: subTable
              ? 'none'
              : '1px solid rgba(224, 224, 224, 1)',
          },
          '& .MuiDataGrid-aggregationColumnHeader--alignLeft': {
            fontSize: 302,
          },
          '& .MuiDataGrid-toolbarContainer': {
            float: 'right',
          },
          ...sx,
        }}
        disableRowSelectionOnClick
        rowSpacingType={'margin'}
        loading={loading}
        paginationMode={'server'}
        filterMode={'server'}
        onFilterModelChange={(model) => onFilterChange?.(model)}
        sortingMode={'server'}
        onSortModelChange={(model) => onSortChange?.(model)}
      />
    </Box>
  );
};

export default TableComponentServerPagination;
