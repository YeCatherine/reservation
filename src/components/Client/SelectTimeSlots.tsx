import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Tooltip,
} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useDay } from '../Calendar/context/DayContext';
import { Slot } from '../../types';
import { ReservationStatus } from '../../consts';
import CircularProgress from '@mui/material/CircularProgress';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * SelectTimeSlots component
 *
 * A component for selecting time slots for a given date.
 *
 * @param {dayjs.Dayjs} date - The selected date
 * @param {Array} availableSlots - Array of available time slots
 * @param {Object} selectedSlot - The selected time slot
 * @param {function} handleSlotClick - Function to handle slot click
 * @param {React.ReactNode} children - Child components
 * @returns {JSX.Element | string | null} The rendered component, "no available slots" message, or null if no date is selected
 */
const SelectTimeSlots: React.FC<{
  availableSlots: Slot[];
  selectedSlot: Slot;
  handleSlotClick: (slot: Slot) => void;
}> = ({ availableSlots, selectedSlot, handleSlotClick }) => {
  const { selectedDate } = useDay();

  if (!selectedDate) {
    return null;
  }

  // Handle loading state
  if (availableSlots === null) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        No available slots
      </Box>
    );
  }

  /**
   * Check if a slot is selected.
   * @param {Object} slot - The time slot object.
   * @returns {boolean} Whether the slot is selected.
   */
  const isSlotSelected = (slot: Slot) =>
    selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;
  /**
   * Prepare the time slots for rendering.
   */
  const prepareSlots = availableSlots.map((slot, index) => {
    const isSelected = isSlotSelected(slot);
    if (isSelected) {
      slot.status = ReservationStatus.SELECTED;
    }

    const ButtonText = `${slot.start} - ${slot.end}`;
    const ButtonVariant =
      slot.status === ReservationStatus.SELECTED
        ? 'contained'
        : slot.status === ReservationStatus.RESERVED ||
            slot.status === ReservationStatus.BOOKED
          ? 'text'
          : 'outlined';
    const ButtonDisabled =
      slot.status === ReservationStatus.DISABLED ||
      slot.status === ReservationStatus.BOOKED ||
      slot.status === ReservationStatus.RESERVED;
    return (
      <Grid item xs={6} sm={4} md={2.4} key={index}>
        <Tooltip title={slot.tooltipText || ''}>
          <Box>
            <Button
              variant={ButtonVariant}
              onClick={() => handleSlotClick(slot)}
              disabled={ButtonDisabled}
              size={'small'}
              sx={{
                margin: 0.5,
                padding: '2px 4px',
                minWidth: '60px',
                cursor: ButtonDisabled ? 'not-allowed' : 'pointer',
                textDecoration:
                  slot.status === ReservationStatus.BOOKED
                    ? 'line-through'
                    : 'none',
                backgroundColor:
                  slot.status === ReservationStatus.SELECTED
                    ? 'primary.light'
                    : slot.status === ReservationStatus.RESERVED
                      ? 'yellow.200'
                      : 'inherit',
                borderColor:
                  slot.status === ReservationStatus.SELECTED
                    ? 'primary.main'
                    : 'grey.300',
              }}
            >
              {ButtonText} {isSelected ? '✔' : ''}
            </Button>
          </Box>
        </Tooltip>
      </Grid>
    );
  });

  return (
    <Card sx={{ padding: 2 }}>
      <CardHeader
        title={
          selectedDate
            ? selectedDate.format('dddd, MMMM D, YYYY')
            : 'Select a date to see available time slots'
        }
      />
      <CardContent
        sx={{ pr: 1, pl: 1, pt: 0, m: 0, '&:last-child': { paddingBottom: 0 } }}
      >
        <Grid container spacing={0.5}>
          {prepareSlots}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SelectTimeSlots;
