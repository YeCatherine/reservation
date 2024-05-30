import { useMemo } from 'react';
import { useModal } from '../ui/Modal/context/ModalProvider';
import { Box, Button } from '@mui/material';
import { Check as CheckIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useReservations } from './context/ReservationContext';
import { ConfirmationDialog } from '../ui/Modal/ConfirmationDialog';
import { ReservationStatus } from '../../consts';
import { SelectProvidersSection } from '../Client/SelectProvidersSection';
import { Reservation } from '../../types';
import { Timer } from './Timer';
import { nanoid } from 'nanoid';

interface ReservationActionsProps {
  reservation: Reservation;
}

/**
 * Confirmation button component.
 *
 * A component for managing actions on reservations such as confirming and deleting.
 *
 * @param {Reservation} reservation - The reservation details.
 * @param {Function} openModal - Function to open the modal.
 * @param {string} confirmRegistrationModalId - The modal ID for confirmation.
 */
const ConfirmationButton = ({
  reservation,
  openModal,
  confirmRegistrationModalId,
}: {
  reservation: Reservation;
  openModal: (id: string) => void;
  confirmRegistrationModalId: string;
}) => {
  if (reservation.status === ReservationStatus.RESERVED) {
    return (
      <>
        <Timer />
        {reservation.providerId === null ? (
          <SelectProvidersSection />
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckIcon />}
            onClick={() => openModal(confirmRegistrationModalId)}
          >
            Confirm
          </Button>
        )}
      </>
    );
  }
  return null;
};

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

  // Save the modal IDs to prevent re-rendering.
  const confirmRegistrationModalId = useMemo(
    () => `confirmationReservationDialog-${nanoid()}`,
    []
  );
  const deleteRegistrationModalId = useMemo(
    () => `deleteReservationDialog-${nanoid()}`,
    []
  );

  const onConfirmRegistration = () => {
    updateExistingReservation(reservation.id, {
      status: ReservationStatus.BOOKED,
    });
    closeModal(confirmRegistrationModalId);
  };

  const onConfirmDelete = () => {
    removeReservation(reservation.id);
    closeModal(deleteRegistrationModalId);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <ConfirmationButton
        reservation={reservation}
        openModal={openModal}
        confirmRegistrationModalId={confirmRegistrationModalId}
      />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => openModal(deleteRegistrationModalId)}
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
