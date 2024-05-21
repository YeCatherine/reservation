import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { useReservations } from '../Reservations/context/ReservationContext';

/**
 * SelectProvidersSection component
 *
 * A component for selecting a specific provider from available options.
 */
export function SelectProvidersSection(): JSX.Element | null {
  const { reservation, updateExistingReservation } = useReservations();

  /**
   * Handle chip click to update the provider for the reservation.
   */
  const handleChipClick = (id: number | 'provider1') => {
    updateExistingReservation(reservation.id, { providerId: id });
  };

  /**
   * Handle delete action to reset the provider selection.
   */
  const handleDelete = () => {
    updateExistingReservation(reservation.id, { providerId: null });
  };

  if (
    !reservation ||
    reservation.slot.availableProviders.length < 1 ||
    reservation.providerId !== null
  ) {
    return null;
  }

  return (
    <Box mt={2}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Grid
          container
          spacing={1}
          justifyContent={'center'}
          alignItems={'center'}
          sx={{ gap: '10px' }}
        >
          <Typography variant="h5" align="center" color="text.secondary">
            Select Exact Provider
          </Typography>
          {reservation.slot.availableProviders.map((providerId) => (
            <Grid item key={providerId} sx={{ m: 0, p: '0px !important' }}>
              <Chip
                label={providerId}
                clickable
                color={
                  reservation.providerId === providerId ? 'primary' : 'default'
                }
                onClick={() => handleChipClick(providerId)}
                onDelete={
                  reservation.providerId === providerId
                    ? handleDelete
                    : undefined
                }
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
