import React from 'react';
import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import { ALL_PROVIDERS, useProvider } from './context/ProviderContext';
import { useModal } from '../ui/Modal/context/ModalProvider';

/**
 * SelectProvidersSection component
 *
 * A component for selecting a specific provider for a given time slot.
 *
 * @param {Object} selectedSlot - The selected time slot
 * @param {Array} availableProvidersForSlot - Array of available providers for the selected slot
 * @returns {JSX.Element | null} The rendered component or null if no providers are available
 */
export function SelectProvidersSection({
  selectedSlot,
  availableProvidersForSlot,
}) {
  const { currentProvider, setCurrentProvider } = useProvider<
    number | 'provider1'
  >(ALL_PROVIDERS);
  const { openModal, closeModal, setModalData, getModalData } = useModal();

  if (!selectedSlot || availableProvidersForSlot.length === 0) {
    return null;
  }

  /**
   * Handle chip click event to select a provider.
   * @param {number | 'provider1'} id - The provider ID
   */
  const handleChipClick = (id: number | 'provider1') => {
    setCurrentProvider(id);
  };

  /**
   * Handle chip delete event to reset the provider selection.
   */
  const handleDelete = () => {
    setCurrentProvider(ALL_PROVIDERS);
  };

  return (
    <Box mt={2}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          sx={{ gap: '10px' }}
        >
          <Typography variant="h5" align="center" color="text.secondary">
            Select Exact Provider
          </Typography>
          {availableProvidersForSlot.map((provider) => (
            <Grid item key={provider.id} sx={{ m: 0, p: '0px !important' }}>
              <Chip
                label={provider.name}
                clickable
                color={currentProvider === provider.id ? 'primary' : 'default'}
                onClick={() => handleChipClick(provider.id)}
                onDelete={
                  currentProvider === provider.id ? handleDelete : undefined
                }
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
