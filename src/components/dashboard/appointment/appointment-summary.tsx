import { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  TextField, Theme,
  Typography,
  useMediaQuery
} from '@mui/material';
import type { Appointment } from '../../../types/appointment';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../property-list-item';

interface AppointmentDetailsProps {
  appointment: Appointment;
}

const statusOptions = ['Canceled', 'Complete', 'Rejected'];

export const AppointmentSummary: FC<AppointmentDetailsProps> = (props) => {
  const { appointment, ...other } = props;
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [status, setStatus] = useState<string>(statusOptions[0]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const align = smDown ? 'vertical' : 'horizontal';

  return (
    <Card {...other}>
      <CardHeader title="Basic info" />
      <Divider />
      <PropertyList>
        <PropertyListItem
          align={align}
          label="Customer"
        >
          <Typography
            color="primary"
            variant="body2"
          >
            {appointment.customer.name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {appointment.customer.address1}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {appointment.customer.city}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {appointment.customer.country}
          </Typography>
        </PropertyListItem>
        <Divider />
        <PropertyListItem
          align={align}
          label="ID"
          value={appointment.id}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Invoice"
          value={appointment.number}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Date"
          value={format(appointment.createdAt, 'dd/MM/yyyy HH:mm')}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Promotion Code"
          value={appointment.promotionCode}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Total Amount"
          value={`${appointment.currency}${appointment.totalAmount}`}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Status"
        >
          <Box
            sx={{
              alignItems: {
                sm: 'center'
              },
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row'
              },
              mx: -1
            }}
          >
            <TextField
              label="Status"
              margin="normal"
              name="status"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              sx={{
                flexGrow: 1,
                m: 1,
                minWidth: 150
              }}
              value={status}
            >
              {statusOptions.map((statusOption) => (
                <option
                  key={statusOption}
                  value={statusOption}
                >
                  {statusOption}
                </option>
              ))}
            </TextField>
            <Button
              sx={{ m: 1 }}
              variant="contained"
            >
              Save
            </Button>
            <Button sx={{ m: 1 }}>
              Cancel
            </Button>
          </Box>
        </PropertyListItem>
      </PropertyList>
    </Card>
  );
};

AppointmentSummary.propTypes = {
  // @ts-ignore
  appointment: PropTypes.object.isRequired
};
