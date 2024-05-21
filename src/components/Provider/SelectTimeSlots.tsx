import { generateTimeSlots } from '../../utils/generateTimeSlots.tsx';
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

dayjs.extend(utc);
dayjs.extend(timezone);

export default function SelectTimeSlots({ date }) {
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
          <DateTimeRangePicker />
        </Grid>
      </CardContent>
    </Card>
  );
}
