import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { appointmentApi } from '../../../__fake-api__/appointment-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { AppointmentDrawer } from '../../../components/dashboard/appointment/appointment-drawer';
import { AppointmentListTable } from '../../../components/dashboard/appointment/appointment-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Plus as PlusIcon } from '../../../icons/plus';
import { Search as SearchIcon } from '../../../icons/search';
import { gtm } from '../../../lib/gtm';
import type {
  Appointment,
  AppointmentStatus,
} from '../../../types/appointment';
import { PageLayout } from '@components/page-layout';

interface Filters {
  query?: string;
  status?: AppointmentStatus;
}

const tabs = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Canceled',
    value: 'canceled',
  },
  {
    label: 'Completed',
    value: 'complete',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Rejected',
    value: 'rejected',
  },
];

const sortOptions = [
  {
    label: 'Newest',
    value: 'desc',
  },
  {
    label: 'Oldest',
    value: 'asc',
  },
];

const applyFilters = (appointments: Appointment[], filters: Filters) =>
  appointments.filter((appointment) => {
    if (filters.query) {
      // Checks only the appointment number, but can be extended to support other fields, such as customer
      // name, email, etc.
      const containsQuery = appointment!.number
        .toLowerCase()
        .includes(filters.query.toLowerCase());

      if (!containsQuery) {
        return false;
      }
    }

    if (typeof filters.status !== 'undefined') {
      const statusMatched = appointment.status === filters.status;

      if (!statusMatched) {
        return false;
      }
    }

    return true;
  });

const applySort = (appointments: Appointment[], appointment: 'asc' | 'desc') =>
  appointments.sort((a, b) => {
    const comparator = a.createdAt > b.createdAt ? -1 : 1;

    return appointment === 'desc' ? comparator : -comparator;
  });

const applyPagination = (
  appointments: Appointment[],
  page: number,
  rowsPerPage: number
): Appointment[] =>
  appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const AppointmentListInner = styled('div', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  overflow: 'hidden',
  paddingBottom: theme.spacing(8),
  paddingTop: theme.spacing(8),
  zIndex: 1,
  [theme.breakpoints.up('lg')]: {
    marginRight: -500,
  },
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    [theme.breakpoints.up('lg')]: {
      marginRight: 0,
    },
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const AppointmentList: NextPage = () => {
  const isMounted = useMounted();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const queryRef = useRef<HTMLInputElement | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filters, setFilters] = useState<Filters>({
    query: '',
    status: undefined,
  });
  const [drawer, setDrawer] = useState<{
    isOpen: boolean;
    appointmentId: string | null;
  }>({
    isOpen: false,
    appointmentId: null,
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getAppointments = useCallback(async () => {
    try {
      const data = await appointmentApi.getAppointments();

      if (isMounted()) {
        setAppointments(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getAppointments();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
    setFilters((prevState) => ({
      ...prevState,
      status: value === 'all' ? undefined : (value as AppointmentStatus),
    }));
  };

  const handleQueryChange = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFilters((prevState) => ({
      ...prevState,
      query: queryRef.current?.value,
    }));
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value as 'asc' | 'desc';
    setSort(value);
  };

  const handlePageChange = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenDrawer = (appointmentId: string): void => {
    setDrawer({
      isOpen: true,
      appointmentId,
    });
  };

  const handleCloseDrawer = () => {
    setDrawer({
      isOpen: false,
      appointmentId: null,
    });
  };

  // Usually query is done on backend with indexing solutions
  const filteredAppointments = applyFilters(appointments, filters);
  const sortedAppointments = applySort(filteredAppointments, sort);
  const paginatedAppointments = applyPagination(
    sortedAppointments,
    page,
    rowsPerPage
  );

  return (
    <PageLayout metaTitle={`Dashboard: Appointment List`}>
      <Box
        component='main'
        ref={rootRef}
        sx={{
          backgroundColor: 'background.paper',
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        <AppointmentListInner open={drawer.isOpen}>
          <Box sx={{ px: 3 }}>
            <Grid container justifyContent='space-between' spacing={3}>
              <Grid item>
                <Typography variant='h4'>Appointments</Typography>
              </Grid>
              <Grid item>
                <Button
                  startIcon={<PlusIcon fontSize='small' />}
                  variant='contained'
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            <Tabs
              indicatorColor='primary'
              onChange={handleTabsChange}
              scrollButtons='auto'
              textColor='primary'
              value={currentTab}
              sx={{ mt: 3 }}
              variant='scrollable'
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
          </Box>
          <Divider />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              m: -1.5,
              p: 3,
            }}
          >
            <Box
              component='form'
              onSubmit={handleQueryChange}
              sx={{
                flexGrow: 1,
                m: 1.5,
              }}
            >
              <TextField
                defaultValue=''
                fullWidth
                inputProps={{ ref: queryRef }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon fontSize='small' />
                    </InputAdornment>
                  ),
                }}
                placeholder='Search by appointment number'
              />
            </Box>
            <TextField
              label='Sort By'
              name='appointment'
              onChange={handleSortChange}
              select
              SelectProps={{ native: true }}
              sx={{ m: 1.5 }}
              value={sort}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Box>
          <Divider />
          <AppointmentListTable
            onOpenDrawer={handleOpenDrawer}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            appointments={paginatedAppointments}
            appointmentsCount={filteredAppointments.length}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </AppointmentListInner>
        <AppointmentDrawer
          containerRef={rootRef}
          onClose={handleCloseDrawer}
          open={drawer.isOpen}
          appointment={appointments.find(
            (appointment) => appointment.id === drawer.appointmentId
          )}
        />
      </Box>
    </PageLayout>
  );
};

AppointmentList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default AppointmentList;
