import React from 'react';
import { Reservation } from '../../types';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import dayjs from 'dayjs';
import { ReservationActions } from './ReservationActions';
import { useReservations } from './context/ReservationContext';

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
    if (reservation.slots) {
      return reservation.slots
        .map((slot) => `${slot.start} - ${slot.end}`)
        .join(', ');
    } else if (reservation.slot) {
      const provider = reservation.providerId
        ? `| Provider: ${reservation.providerId}`
        : '';
      return `Reserved time: ${reservation.slot.start} - ${reservation.slot.end} | Status: ${reservation.status} ${provider}`;
    }
    return '';
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
