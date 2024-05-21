import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import dayjs from 'dayjs';
import DebugPanel from '../DebugPanel';
import { ReservationActions } from './ReservationActions';
import { useReservations } from './context/ReservationContext';
import { Reservation } from '../../utils/reservationService';

/**
 * Reservations component
 *
 * A component for displaying a list of reservations.
 *
 * @returns {JSX.Element | null} The rendered component or null if no reservations exist
 */
const Reservations: React.FC = () => {
  const { reservations } = useReservations();

  /**
   * Prepare the display text for a reservation.
   *
   * @param {Reservation} reservation - The reservation object
   *
   * @returns {string} The formatted text for the reservation
   */
  const prepareText = (reservation: Reservation): string => {
    if ('slots' in reservation) {
      return reservation.slots
        .map((slot) => `${slot.start} - ${slot.end}`)
        .join(', ');
    } else {
      return `Reserved time: ${reservation.slot.start} - ${reservation.slot.end} | Status: ${reservation.status}`;
    }
  };

  if (reservations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="All Submitted Schedules" subheader="TimeZone (UTC)" />
      <CardContent
        sx={{
          pr: 1,
          pl: 1,
          pt: 0,
          m: 0,
          '&:last-child': { paddingBottom: 0 },
        }}
      >
        <Divider />
        <List>
          {reservations.map((reservation) => (
            <ListItem
              key={reservation.id}
              sx={{
                borderBottom: '1px solid #ccc',
                padding: 1,
                backgroundColor: 'primary',
              }}
            >
              <ListItemText
                primary={dayjs(reservation.date).format('MMMM D, YYYY')}
                secondary={prepareText(reservation)}
              />
              <ReservationActions reservation={reservation} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default Reservations;
