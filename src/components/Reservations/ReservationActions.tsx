import React from 'react';
import { Box, Button } from '@mui/material';
import { Check as CheckIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useModal } from '../ui/Modal/context/ModalProvider';
import { useReservations } from './context/ReservationContext';
import { ConfirmationDialog } from '../ui/Modal/ConfirmationDialog';
import { Reservation } from '../../utils/reservationService';

/**
 * ReservationActions component
 *
 * A component for displaying action buttons for a reservation.
 *
 * @param {Reservation} reservation - The reservation object
 */
export function ReservationActions({
  reservation,
}: {
  reservation: Reservation;
}): JSX.Element {
  const { openModal, closeModal } = useModal();
  const { removeReservation, updateExistingReservation } = useReservations();
  const confirmRegistrationModalId = 'confirmationReservationDialog';
  const deleteRegistrationModalId = 'deleteReservationDialog';

  /**
   * Handle reservation confirmation.
   */
  const onConfirmRegistration = () => {
    updateExistingReservation(reservation.id, { status: 'confirmed' });
    closeModal(confirmRegistrationModalId);
  };

  /**
   * Handle reservation deletion.
   */
  const onConfirmDelete = () => {
    removeReservation(reservation.id);
    closeModal(deleteRegistrationModalId);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      {reservation.status === 'pending' && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckIcon />}
          onClick={() => {
            openModal(confirmRegistrationModalId);
          }}
        >
          Confirm
        </Button>
      )}
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          openModal(deleteRegistrationModalId);
        }}
        startIcon={<DeleteIcon />}
      >
        Delete Reservation
      </Button>

      <ConfirmationDialog
        modalId={confirmRegistrationModalId}
        modalTitle="Confirm Your Reservation"
        modalText={`Do you want to confirm your reservation for ${reservation.date}? Slot: ${reservation.slot.start} - ${reservation.slot.end}`}
        onConfirm={onConfirmRegistration}
      />
      <ConfirmationDialog
        modalId={deleteRegistrationModalId}
        modalTitle="Confirm to Delete Reservation"
        modalText={`Do you want to delete your reservation for ${reservation.date}? Slot: ${reservation.slot.start} - ${reservation.slot.end}`}
        onConfirm={onConfirmDelete}
      />
    </Box>
  );
}
