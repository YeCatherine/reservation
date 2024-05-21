import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import DebugPanel from '../DebugPanel';
import { ReservationActions } from './ReservationActions';
import { Reservation } from '../../utils/reservationService';

interface ReservationSubmitProps {
  selectedSlot: any;
  availableProvidersForSlot: any[];
  timer: number | null;
  reservation: Reservation | null;
  editReservation?: () => void;
}

/**
 * ReservationSubmit component
 *
 * A component for displaying the reservation submission details and actions.
 *
 * @param {ReservationSubmitProps} props - Component props
 * @returns {JSX.Element | null} The rendered component or null if no reservation or providers available
 */
export const ReservationSubmit: React.FC<ReservationSubmitProps> = ({
  selectedSlot,
  availableProvidersForSlot,
  timer,
  reservation,
}) => {
  /**
   * Render the countdown timer.
   *
   * @returns {JSX.Element | null} The rendered timer or null if no timer is set
   */
  const renderTimer = (): JSX.Element | null => {
    if (timer !== null) {
      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;
      return (
        <Typography variant="body2" color="error" align="center">
          Time left to confirm: {minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </Typography>
      );
    }
    return null;
  };

  if (
    reservation === null ||
    (selectedSlot && availableProvidersForSlot.length === 0)
  ) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <DebugPanel data={{ reservation, selectedSlot }} />
        {renderTimer()}
        <ReservationActions reservation={reservation} />
      </CardContent>
    </Card>
  );
};
