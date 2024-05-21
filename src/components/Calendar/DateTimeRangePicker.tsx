import React, { useEffect, useState } from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { Button, Chip, Grid, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { DATE_TIME_FORMAT } from '../../consts';
import { useAuth } from '../Auth/context/AuthContext';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { updateProvidersAvailability } from '../../utils/providersAvailability';
import { DateRange, TimeSlot } from '../../types';
import { useProvider } from '../Client/context/ProviderContext';
import { useDay } from './context/DayContext';
import DebugPanel from '../DebugPanel';

dayjs.extend(isSameOrBefore);

/**
 * DateTimeRangePicker component
 *
 * A component to select and manage date and time ranges.
 *
 * @param {function} setTimeSlots - Function to set time slots
 * @returns {JSX.Element} The rendered component
 */
const DateTimeRangePicker: React.FC<{
  setTimeSlots: (slots: TimeSlot[]) => void;
}> = ({ setTimeSlots }) => {
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

  const [selectedDays, setSelectedDays] = useState<boolean[]>([
    false,
    true,
    true,
    true,
    true,
    true,
    false,
  ]);

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
   * @param {Dayjs | null} newValue - The new date value
   * @param {'start' | 'end'} type - The type of date (start or end)
   */
  const handleDateChange = (newValue: Dayjs | null, type: 'start' | 'end') => {
    setDateRange((prev) => ({ ...prev, [type]: newValue }));
  };

  /**
   * Handle change of time range.
   * @param {Dayjs | null} newValue - The new time value
   * @param {number} index - The index of the time slot
   * @param {'start' | 'end'} type - The type of time (start or end)
   */
  const handleTimeChange = (
    newValue: Dayjs | null,
    index: number,
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
   * Handle change of selected days.
   * @param {number} index - The index of the selected day
   */
  const handleDayChange = (index: number) => {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[index] = !newSelectedDays[index];
    setSelectedDays(newSelectedDays);
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
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <TimePicker
            label="Start Time"
            value={preparedTimeSlotStart}
            onChange={(newValue) => handleTimeChange(newValue, 0, 'start')}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={5}>
          <TimePicker
            label="End Time"
            value={preparedTimeSlotEnd}
            onChange={(newValue) => handleTimeChange(newValue, 0, 'end')}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={2}>
          {timeSlot === null ? (
            <Chip
              label="Set Default Time"
              onClick={() =>
                setTimeSlot({ start: defaultStartTime, end: defaultEndTime })
              }
            />
          ) : (
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Grid>
      </Grid>
      <DebugPanel data={availableSlots} title="available slots" />
    </LocalizationProvider>
  );
};

export default DateTimeRangePicker;
