import React, { useEffect, useState } from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { Button, Chip, Grid, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { DATE_TIME_FORMAT } from '../../consts';
import { useAuth } from '../Auth/context/AuthContext.tsx';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { updateProvidersAvailability } from '../../utils/providersService.ts';
import { DateRange, TimeSlot } from '../../types';
import { useProvider } from '../Client/context/ProviderContext.tsx';
import { useDay } from './context/DayContext.tsx';

dayjs.extend(isSameOrBefore);

/**
 * DateTimeRangePicker component
 *
 * A component to select and manage date and time ranges.
 *
 * @param {function} setTimeSlots - Function to set time slots
 * @returns {JSX.Element} The rendered component
 */
const DateTimeRangePicker: React.FC = (): JSX.Element => {
  const { selectedDate, setSelectedDate, selectedTimezone } = useDay();
  const { availableSlots, setAvailableSlots, currentDaySlots } = useProvider();
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(currentDaySlots);

  useEffect(() => {
    if (currentDaySlots) {
      setTimeSlot(currentDaySlots);
    } else {
      setTimeSlot(null);
    }
  }, [currentDaySlots, selectedDate]);

  const { user } = useAuth();

  const defaultStartTime = selectedDate.hour(8).minute(0);
  const defaultEndTime = selectedDate.hour(15).minute(0);

  const [dateRange, setDateRange] = useState<DateRange>({
    start: dayjs(),
    end: dayjs().add(1, 'month'),
  });

  useEffect(() => {
    if (selectedDate) {
      setDateRange((prev) => ({
        start: selectedDate,
        end: prev.end.isSameOrBefore(selectedDate)
          ? selectedDate.add(1, 'month')
          : prev.end,
      }));
    }
  }, [selectedDate]);

  /**
   * Handle change of date range.
   * @param {Dayjs | null} newValue - The new date value.
   * @param {'start' | 'end'} type - The type of date (start or end).
   */
  const handleDateChange = (newValue: Dayjs | null, type: 'start' | 'end') => {
    setDateRange((prev) => ({ ...prev, [type]: newValue }));
  };

  /**
   * Handle change of time range.
   * @param {Dayjs | null} newValue - The new time value.
   * @param {number} index - The index of the time slot
   * @param {'start' | 'end'} type - The type of time (start or end).
   */
  const handleTimeChange = (
    newValue: Dayjs | null,
    type: 'start' | 'end'
  ) => {
    setTimeSlot((prev) => {
      if (!prev) {
        return {
          start: type === 'start' ? newValue : defaultStartTime,
          end: type === 'end' ? newValue : defaultEndTime,
        };
      }
      return {
        ...prev,
        [type]: newValue,
      };
    });
  };

  /**
   * Handle form submission.
   */
  const handleSubmit = async () => {
    const availability = {
      date: selectedDate.format(DATE_TIME_FORMAT),
      timezone: selectedTimezone,
      start: timeSlot?.start ? timeSlot.start.format('HH:mm') : null,
      end: timeSlot?.end ? timeSlot.end.format('HH:mm') : null,
    };

    console.log('availability save: ', availability);
    const providerId = user.id;
    const response = await updateProvidersAvailability(
      providerId,
      availability
    );
    setAvailableSlots(response);
  };

  const preparedTimeSlotStart = timeSlot?.start || null;
  const preparedTimeSlotEnd = timeSlot?.end || null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item lg={6} md={6} xs={12}>
          <TimePicker
            label="Start Time"
            value={preparedTimeSlotStart}
            onChange={(newValue) => handleTimeChange(newValue, 'start')}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <TimePicker
            label="End Time"
            value={preparedTimeSlotEnd}
            onChange={(newValue) => handleTimeChange(newValue, 'end')}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          {timeSlot === null ? (
            <Chip
              label="Set Default Time"
              onClick={() =>
                setTimeSlot({ start: defaultStartTime, end: defaultEndTime })
              }
            />
          ) : (
            <Button variant="contained" onClick={handleSubmit} fullWidth>
              Submit
            </Button>
          )}
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateTimeRangePicker;
