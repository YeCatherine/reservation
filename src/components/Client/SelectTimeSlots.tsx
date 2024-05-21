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
import { ReservationStatus } from '../../consts';
import { useReservations } from '../Reservations/context/ReservationContext.tsx';
dayjs.extend(utc);
dayjs.extend(timezone);

const guessTZ = dayjs.tz.guess();

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
  availableSlots: any[];
  selectedSlot: any;
  handleSlotClick: (slot: any) => void;
  todaysBookedSlots: any[];
}> = ({ availableSlots, selectedSlot, handleSlotClick, todaysBookedSlots }) => {
  const { selectedDate } = useDay();

  if (!selectedDate) {
    return null;
  }

  if (!availableSlots || availableSlots.length === 0) {
    return 'No available slots';
  }

  /**
   * Get the status of a slot.
   * @param {Object} slot - The time slot object.
   * @returns {Object} The status and tooltip text for the slot.
   */
  const getSlotStatus = (slot) => {
    const { reservations } = useReservations();
    const bookedSlot = todaysBookedSlots?.find(
      (booked) =>
        booked.slot.start === slot.start && booked.slot.end === slot.end
    );
    const currentTime = dayjs().tz(guessTZ);
    const next24Hours = currentTime.add(24, 'hours');

    const slotStart = dayjs.tz(
      `${selectedDate.format('YYYY-MM-DD')} ${slot.start}`,
      'YYYY-MM-DD HH:mm',
      guessTZ
    );
    const disabled = slotStart.isBefore(next24Hours);

    if (disabled) {
      return { isDisabled: true, tooltipText: 'Please book in 24 hours ahead' };
    }

    if (bookedSlot) {
      switch (bookedSlot.status) {
        case ReservationStatus.CONFIRMED:
          return { isBooked: true, tooltipText: 'Booked' };
        case ReservationStatus.PENDING:
          return { isReserved: true, tooltipText: 'Reserved' };
        default:
          return {};
      }
    }

    if (
      reservations?.find(
        (reserved) =>
          reserved.slot.start === slot.start && reserved.slot.end === slot.end
      )
    ) {
      return { isReserved: true, tooltipText: 'Reserved' };
    }
    return {};
  };

  /**
   * Check if a slot is selected.
   * @param {Object} slot - The time slot object.
   * @returns {boolean} Whether the slot is selected.
   */
  const isSlotSelected = (slot: any) =>
    selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;

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
          {availableSlots.map((slot, index) => {
            const { isDisabled, isBooked, isReserved, tooltipText } =
              getSlotStatus(slot);
            const isSelected = isSlotSelected(slot);

            return (
              <Grid item xs={6} sm={4} md={2.4} key={index}>
                <Tooltip title={tooltipText || ''}>
                  <Box>
                    <Button
                      variant={
                        isBooked ? 'text' : isReserved ? null : 'outlined'
                      }
                      onClick={() => handleSlotClick(slot)}
                      disabled={isDisabled || isBooked || isReserved}
                      size={'small'}
                      sx={{
                        margin: 0.5,

                        padding: '2px 4px',
                        minWidth: '60px',
                        cursor:
                          isDisabled || isBooked || isReserved
                            ? 'not-allowed'
                            : 'pointer',
                        textDecoration: isBooked ? 'line-through' : 'none',
                        backgroundColor: isSelected
                          ? 'primary.light'
                          : isReserved
                            ? 'yellow.200'
                            : 'inherit',
                        borderColor: isSelected ? 'primary.main' : 'grey.300',
                      }}
                    >
                      {slot.start} - {slot.end}
                    </Button>
                  </Box>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SelectTimeSlots;
