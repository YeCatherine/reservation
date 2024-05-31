import { useReservations } from './context/ReservationContext.tsx';
import { Typography } from '@mui/material';

/**
 * Timer component.
 * @constructor
 */
export const Timer = () => {
  const { timer } = useReservations();
  if (timer !== null) {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return (
      <Typography variant="body2" color="error" align="center">
        Time left to confirm: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </Typography>
    );
  }
  return null;
};
