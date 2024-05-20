import { generateTimeSlots } from '../../utils/GenerateTimeSlots.tsx';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import DateTimeRangePicker from '../Calendar/DateTimeRangePicker.tsx';
import { useProvider } from '../Client/context/ProviderContext.tsx';
import { TimeSlot } from '../../types';
import { useDay } from '../Calendar/context/DayContext.tsx';
import DebugPanel from '../DebugPanel.tsx';

dayjs.extend(utc);
dayjs.extend(timezone);

const guessTZ = dayjs.tz.guess();

export default function SelectTimeSlots({
  date,
  selectedDateSlots,
  handleSlotClick,
}) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  if (!date) {
    return null;
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
          <DateTimeRangePicker setTimeSlots={setTimeSlots} />
          <Divider />
          {/*<AvailableTimeSlots*/}
          {/*  timeSlots={timeSlots}*/}
          {/*  selectedDateSlots={selectedDateSlots}*/}
          {/*  handleSlotClick={handleSlotClick}*/}
          {/*/>*/}
        </Grid>
      </CardContent>
    </Card>
  );
}

export const AvailableTimeSlots = ({
  timeSlots,
  selectedDateSlots,
  handleSlotClick,
}) => {
  const {
    selectedDate,
    setSelectedDate,
    selectedTimezone,
    setSelectedTimezone,
  } = useDay();
  const { availableSlots, setAvailableSlots } = useProvider();
  if (timeSlots.length === 0)
    return (
      <Card>
        <CardContent>No available time slot for that day</CardContent>
      </Card>
    );

  const prepareTimeSlots = (timeSlots) => {
    const generatedSlots = generateTimeSlots(
      selectedTimezone,
      timeSlots.length > 0 ? timeSlots[0].start.hour() : 8,
      timeSlots.length > 0 ? timeSlots[0].end.hour() : 15,
      selectedDateSlots
    );

    // Merge available slots with selected date slots
    const mergedSlots = [...generatedSlots, ...availableSlots];

    // Sort the merged slots by start time
    mergedSlots.sort((a, b) => {
      const startA = dayjs(a.start, 'HH:mm');
      const startB = dayjs(b.start, 'HH:mm');
      return startA.isBefore(startB) ? -1 : startA.isAfter(startB) ? 1 : 0;
    });
    return mergedSlots;
  };

  const mergedSlots = prepareTimeSlots(timeSlots);

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Booked Time Slots : <pre>{JSON.stringify(availableSlots, null, 4)}</pre>
        ===
        <DebugPanel data={selectedDate.format('YYYY-MM-DD')} />
      </Typography>
      <Grid container spacing={0.1}>
        {mergedSlots.map((slot, index) => (
          <Grid item xs={6} sm={4} md={2.4} key={index}>
            <Button
              variant="outlined"
              onClick={() => handleSlotClick(slot)}
              sx={{
                margin: 0.5,
                padding: '2px 4px',
                minWidth: '60px',
                backgroundColor: slot.selected ? 'primary.light' : 'inherit',
                borderColor: slot.selected ? 'primary.main' : 'grey.300',
              }}
            >
              {slot.start} - {slot.end}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
