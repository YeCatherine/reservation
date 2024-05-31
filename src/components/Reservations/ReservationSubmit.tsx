import React from 'react';
import { Card, CardContent } from '@mui/material';
import { ReservationActions } from './ReservationActions.tsx';
import { useReservations } from './context/ReservationContext.tsx';

export const ReservationSubmit: React.FC = () => {
  const { reservation } = useReservations();

  if (!reservation || reservation.providerId === null) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <ReservationActions reservation={reservation} />
      </CardContent>
    </Card>
  );
};
