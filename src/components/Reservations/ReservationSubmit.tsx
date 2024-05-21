import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { ReservationActions } from './ReservationActions.tsx';
import { useReservations } from './context/ReservationContext.tsx';

export const ReservationSubmit: React.FC = () => {
  const { reservation, timer } = useReservations();
  const renderTimer = () => {
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
  if (!reservation || reservation.providerId === null) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        {renderTimer()}
        <ReservationActions reservation={reservation} />
      </CardContent>
    </Card>
  );
};
