import type { ChangeEvent, FC, MouseEvent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import moment from 'moment';
import numeral from 'numeral';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Appointment } from '../../../types/appointment';
import { SeverityPill } from '../../severity-pill';
import type { SeverityPillColor } from '../../severity-pill';

interface AppointmentListTableProps {
  onOpenDrawer?: (appointmentId: string) => void;
  onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  appointments: Appointment[];
  appointmentsCount: number;
  page: number;
  rowsPerPage: number;
}

const severityMap: { [key: string]: SeverityPillColor; } = {
  approuved: 'success',
  complete: 'success',
  pending: 'info',
  canceled: 'warning',
  rejected: 'error'
};

export const AppointmentListTable: FC<AppointmentListTableProps> = (props) => {
  const {
    onOpenDrawer,
    onPageChange,
    onRowsPerPageChange,
    appointments,
    appointmentsCount,
    page,
    rowsPerPage,
    ...other
  } = props;

  return (
    <div {...other}>
      <Table>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow
              hover
              key={appointment.id}
              onClick={() => onOpenDrawer?.(appointment.id)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <Box
                  sx={{
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                      ? 'neutral.800'
                      : 'neutral.200',
                    borderRadius: 2,
                    maxWidth: 'fit-content',
                    ml: 3,
                    p: 1
                  }}
                >
                  <Typography
                    align="center"
                    variant="subtitle2"
                  >
                    {moment(appointment.requestedDate).format("MMM").toUpperCase()}
                  </Typography>
                  <Typography
                    align="center"
                    variant="h6"
                  >
                    {moment(appointment.requestedDate).format("d")}
                  </Typography>
                </Box>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle2">
                    {appointment.number}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  > {appointment.fullName}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  > {appointment.email}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    {appointment.phoneNumber}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <SeverityPill color={severityMap[appointment.status] || 'warning'}>
                  {appointment.status}
                </SeverityPill>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={appointmentsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

AppointmentListTable.propTypes = {
  onOpenDrawer: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  appointments: PropTypes.array.isRequired,
  appointmentsCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
