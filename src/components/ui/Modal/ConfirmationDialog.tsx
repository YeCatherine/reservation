import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';
import { useModal } from './context/ModalProvider.tsx';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

/**
 * Confirmation dialog.
 *
 * @param modalId
 * @param modalTitle
 * @param modalText
 * @param onConfirm
 * @param onCancel
 * @constructor
 */
export function ConfirmationDialog({
  modalId = 'confirmationDialog',
  modalTitle,
  modalText,
  onConfirm,
}: {
  modalId: string;
  modalTitle: string;
  modalText: string;
  onConfirm: () => void;
}) {
  const { modalState, closeModal } = useModal();
  const onCancel = () => {
    // setOpenConfirmDialog(false);
    closeModal(modalId);
  };
  return (
    <Dialog
      open={modalState[modalId] || false}
      onClose={() => closeModal(modalId)}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{modalTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">
          {modalText}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ gap: 2 }}>
        <Button
          onClick={onCancel}
          color="secondary"
          startIcon={<CloseIcon />}
          sx={{ marginRight: 1 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          startIcon={<CheckIcon />}
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
