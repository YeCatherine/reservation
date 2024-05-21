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
export function SelectTimeSlots({
  date,
  availableSlots,
  selectedSlot,
  handleSlotClick,
  children,
}) {
  if (!date) {
    return null;
  }
  if (!availableSlots) {
    return 'no available slots';
  }

  return (
    <Card sx={{ padding: 2 }}>
      <CardHeader
        title={
          date
            ? date.format('dddd, MMMM D, YYYY')
            : 'Select a date to see available time slots'
        }
      />
      <CardContent
        sx={{ pr: 1, pl: 1, pt: 0, m: 0, '&:last-child': { paddingBottom: 0 } }}
      >
        <Grid container spacing={0.5}>
          {availableSlots.map((slot, index) => {
            const isSelected =
              selectedSlot &&
              selectedSlot.start === slot.start &&
              selectedSlot.end === slot.end;

            let isReserved = slot.reserved;
            let remainingText = '';
            if (slot.reserved) {
              const reservedDate = dayjs.unix(slot.reserved);
              const remainingTime = dayjs()
                .tz(guessTZ)
                .diff(dayjs.unix(slot.reserved), 'second');
              if (remainingTime < 0) {
                isReserved = false;
              } else {
                isReserved = true;
                remainingText = `Remaining : (${Math.floor(remainingTime / 60)}:${remainingTime % 60})`;
              }
            } else {
              isReserved = false;
              remainingText = '';
            }
            const toolTipText = slot.tooltip ? slot.tooltip : '';
            return (
              <Grid item xs={6} sm={4} md={2.4} key={index}>
                <Tooltip title={toolTipText}>
                  <Box>
                    <Button
                      variant="outlined"
                      onClick={() => handleSlotClick(slot)}
                      disabled={slot.disabled}
                      sx={{
                        margin: 0.5,
                        padding: '2px 4px',
                        minWidth: '60px',
                        textDecoration:
                          slot.state === 'booked' ? 'line-through' : 'none',
                        backgroundColor: isSelected
                          ? 'primary.light'
                          : isReserved
                            ? 'reserved.light'
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
}
