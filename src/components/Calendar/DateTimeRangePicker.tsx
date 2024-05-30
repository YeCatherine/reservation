import React, { useEffect, useState } from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { Button, Grid, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { DATE_FORMAT, TIME_FORMAT } from '../../consts';
import { useAuth } from '../Auth/context/AuthContext.tsx';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { updateProvidersAvailability } from '../../utils/providersService.ts';
import { Slot } from '../../types';
import { useProvider } from '../Client/context/ProviderContext.tsx';
import { useDay } from './context/DayContext.tsx';

dayjs.extend(isSameOrBefore);

enum ButtonState {
  create = 'create',
  update = 'update',
}

type TButtonState = 'create' | 'update';
/**
 * DateTimeRangePicker component
 *
 * A component to select and manage date and time ranges.
 *
 * @param {function} setTimeSlots - Function to set time slots
 * @returns {JSX.Element} The rendered component
 */
const DateTimeRangePicker: React.FC = (): JSX.Element => {
  const { selectedDate, selectedTimezone } = useDay();
  const { setAvailableSlots, currentDaySlots } = useProvider();
  const [timeSlot, setTimeSlot] = useState<Slot | null>(currentDaySlots);

  const [creteUpdateFlag, setCreteUpdateFlag] = useState<TButtonState>(
    ButtonState.create
  );
  // console.log("creteUpdateFlag", {currentDaySlots, creteUpdateFlag})
  //
  useEffect(() => {
    if (currentDaySlots) {
      setCreteUpdateFlag(ButtonState.update);
    } else {
      setCreteUpdateFlag(ButtonState.create);
    }
    if (currentDaySlots) {
      setTimeSlot(currentDaySlots);
    } else {
      setTimeSlot(null);
    }
  }, [currentDaySlots, selectedDate]);

  const { user } = useAuth();

  const defaultStartTime = selectedDate.hour(8).minute(0);
  const defaultEndTime = selectedDate.hour(15).minute(0);

  /**
   * Handle change of time range.
   * @param {Dayjs | null} newValue - The new time value.
   * @param {number} index - The index of the time slot
   * @param {'start' | 'end'} type - The type of time (start or end).
   */
  const handleTimeChange = (newValue: Dayjs | null, type: 'start' | 'end') => {
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
    setCreteUpdateFlag(ButtonState.update);

    const availability = {
      date: selectedDate.format(DATE_FORMAT),
      timezone: selectedTimezone,
      start: timeSlot?.start ? timeSlot.start.format(TIME_FORMAT) : null,
      end: timeSlot?.end ? timeSlot.end.format(TIME_FORMAT) : null,
    };

    if (!user) return;
    const providerId = user.id;
    const response = await updateProvidersAvailability(
      providerId,
      availability
    );
    setAvailableSlots(response);
  };

  const preparedTimeSlotStart = timeSlot?.start || null;
  const preparedTimeSlotEnd = timeSlot?.end || null;
  // const creteUpdateFlat = (timeSlot === null)? "create" : "update";
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TimePicker
            label="Start Time"
            value={preparedTimeSlotStart}
            onChange={(newValue) => handleTimeChange(newValue, 'start')}
            sx={{
              width: {
                xs: '100%',
                md: '100%',
              },
              margin: {
                xs: '0 auto',
                md: '0 10px',
                lg: '0',
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid="start-time-picker"
                sx={{
                  width: {
                    xs: '100%', // full width on mobile
                    md: '200px', // 200px on desktop
                  },
                  margin: '0 auto', // center the field
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TimePicker
            label="End Time"
            value={preparedTimeSlotEnd}
            onChange={(newValue) => handleTimeChange(newValue, 'end')}
            sx={{
              width: {
                xs: '100%',
                md: '200px',
              },
              margin: {
                xs: '0 auto',
                md: '0 10px',
                lg: '0',
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid="end-time-picker"
                sx={{
                  width: {
                    xs: '100%', // full width on mobile
                    md: '200px', // 200px on desktop
                  },

                  margin: '0 20px', // center the field
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
          {timeSlot === null ||
          timeSlot.start === null ||
          timeSlot.end === null ? (
            <Button
              variant="contained"
              onClick={() =>
                setTimeSlot({ start: defaultStartTime, end: defaultEndTime })
              }
              fullWidth
              data-testid="submit-event-button"
            >
              Set Default Time
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth
              data-testid="submit-event-button"
            >
              {creteUpdateFlag === ButtonState.create ? 'Create' : 'Update'}
            </Button>
          )}
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateTimeRangePicker;
