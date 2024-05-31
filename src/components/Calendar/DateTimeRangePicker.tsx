import React, { useEffect, useState } from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { Button, Grid, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs, guessTZ } from '../../utils/dayJs.ts';
import { DATE_FORMAT, TIME_FORMAT } from '../../consts';
import { useAuth } from '../Auth/context/AuthContext.tsx';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { updateProvidersAvailability } from '../../utils/providersService.ts';
import { Slot } from '../../types';
import { useProvider } from '../Client/context/ProviderContext.tsx';
import { useDay } from './context/DayContext.tsx';
import { prepareTimeSlotPeriod } from '../../utils/timeService.tsx';

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
 * @returns {JSX.Element} The rendered component
 */
const DateTimeRangePicker: React.FC = (): JSX.Element => {
  const { selectedDate, selectedTimezone } = useDay();
  const { setAvailableSlots, currentDaySlots } = useProvider();
  const [timeSlot, setTimeSlot] = useState<Slot | null>(currentDaySlots);
  const [creteUpdateFlag, setCreteUpdateFlag] = useState<TButtonState>(
    ButtonState.create
  );

  useEffect(() => {
    if (currentDaySlots) {
      setCreteUpdateFlag(ButtonState.update);
      setTimeSlot(currentDaySlots);
    } else {
      setCreteUpdateFlag(ButtonState.create);
      setTimeSlot(null);
    }
  }, [currentDaySlots, selectedDate]);

  const { user } = useAuth();

  const defaultStartTime = dayjs(selectedDate).tz(guessTZ).hour(8).minute(0);
  const defaultEndTime = dayjs(selectedDate).tz(guessTZ).hour(15).minute(0);
  console.log('defaultStartEndTime: ', { defaultStartTime, defaultEndTime });
  /**
   * Handle change of time range.
   * @param {Dayjs | null} newValue - The new time value.
   * @param {"start" | "end"} type - The type of time (start or end).
   */
  const handleTimeChange = (newValue: Dayjs | null, type: 'start' | 'end') => {
    try {
      setTimeSlot((prev) => {
        // debugger;
        const newSlot = {
          start:
            type === 'start'
              ? newValue.format(TIME_FORMAT)
              : prev?.slot[0]?.start || null,
          end:
            type === 'end'
              ? newValue.format(TIME_FORMAT)
              : prev?.slot[0]?.end || null,
        };

        let newTimeSlot;
        if (prev) {
          newTimeSlot = {
            date: selectedDate.format(DATE_FORMAT),
            slot: [newSlot],
          };
        } else {
          newTimeSlot = {
            ...prev,
            slot: [newSlot],
          };
        }

        console.log('new time slot: ', newTimeSlot);
        return newTimeSlot;
      });
    } catch (error) {
      console.error('Error occurred while updating time slot:', error);
    }
  };

  /**
   * Handle form submission.
   */
  const handleSubmit = async () => {
    if (!user || !timeSlot) return;
    setCreteUpdateFlag(ButtonState.update);
    const { preparedTimeSlotStart, preparedTimeSlotEnd } =
      prepareTimeSlotPeriod(timeSlot);

    const availability = {
      date: selectedDate.format(DATE_FORMAT),
      timezone: selectedTimezone,
      start: preparedTimeSlotStart?.format(TIME_FORMAT),
      end: preparedTimeSlotEnd?.format(TIME_FORMAT),
    };

    const providerId = user.id;
    const response = await updateProvidersAvailability(
      providerId,
      availability
    );

    setAvailableSlots(response);
  };

  const { preparedTimeSlotStart, preparedTimeSlotEnd } =
    prepareTimeSlotPeriod(timeSlot);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TimePicker
            label="Start Time"
            value={preparedTimeSlotStart}
            onChange={(newValue) => handleTimeChange(newValue, 'start')}
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid="start-time-picker"
                sx={{ width: { xs: '100%', md: '200px' }, margin: '0 auto' }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TimePicker
            label="End Time"
            value={preparedTimeSlotEnd}
            onChange={(newValue) => handleTimeChange(newValue, 'end')}
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid="end-time-picker"
                sx={{ width: { xs: '100%', md: '200px' }, margin: '0 auto' }}
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
              onClick={() => {
                setTimeSlot((prev) => {
                  const newTimeSlot = {
                    ...prev,
                    date: selectedDate.format(DATE_FORMAT),
                    slot: [
                      {
                        start: defaultStartTime.format(TIME_FORMAT),
                        end: defaultEndTime.format(TIME_FORMAT),
                      },
                    ],
                  };
                  console.log('default time slot: ', newTimeSlot);
                  return newTimeSlot;
                });
              }}
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
