import React from 'react';
import { useModal } from '../ui/Modal/context/ModalProvider';
import { Box, Button } from '@mui/material';
import { Check as CheckIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useReservations } from './context/ReservationContext';
import { ConfirmationDialog } from '../ui/Modal/ConfirmationDialog';
import { ReservationStatus } from '../../consts';

interface ReservationActionsProps {
  reservation: any;
}

/**
 * ReservationActions component
 *
 * A component for managing actions on reservations such as confirming and deleting.
 *
 * @param {ReservationActionsProps} props - The component props.
 */
export function ReservationActions({ reservation }: ReservationActionsProps) {
  const { openModal, closeModal } = useModal();
  const { removeReservation, updateExistingReservation } = useReservations();
  const confirmRegistrationModalId = 'confirmationReservationDialog';
  const deleteRegistrationModalId = 'deleteReservationDialog';

  /**
   * Handle confirmation of a reservation.
   */
  const onConfirmRegistration = () => {
    updateExistingReservation(reservation.id, {
      status: ReservationStatus.CONFIRMED,
    });
    closeModal(confirmRegistrationModalId);
  };

  /**
   * Handle deletion of a reservation.
   */
  const onConfirmDelete = () => {
    removeReservation(reservation.id);
    closeModal(deleteRegistrationModalId);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      {reservation.status === ReservationStatus.PENDING && (
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
        Delete
      </Button>

      <ConfirmationDialog
        modalId={confirmRegistrationModalId}
        modalTitle="Confirm Your Reservation"
        modalText={`Do you want to confirm your reservation for ${reservation.date}. Slot: ${reservation.slot.start} - ${reservation.slot.end}?`}
        onConfirm={onConfirmRegistration}
      />
      <ConfirmationDialog
        modalId={deleteRegistrationModalId}
        modalTitle="Confirm to Delete Reservation"
        modalText={`Do you want to delete your reservation for ${reservation.date}. Slot: ${reservation.slot.start} - ${reservation.slot.end}?`}
        onConfirm={onConfirmDelete}
      />
    </Box>
  );
}
