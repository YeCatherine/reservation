import React from 'react';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';
import { DATE_TIME_FORMAT } from '../../consts';
import { Schedule } from '../../types';
import { ALL_PROVIDERS, useProvider } from '../Client/context/ProviderContext';

/**
 * BuzyDay component
 *
 * Shows a badge with the number of slots available for a given day.
 *
 * @param {PickersDayProps<Dayjs> & { schedules?: Schedule[] }} props - Component props.
 * @returns {JSX.Element} The rendered component.
 */
export function BuzyDay(
  props: PickersDayProps<Dayjs> & { schedules?: Schedule[] }
) {
  const { day, outsideCurrentMonth, schedules = [], ...other } = props;
  const { availableSlots } = useProvider<number | 'provider1'>(ALL_PROVIDERS);

  const currentDate = day.format(DATE_TIME_FORMAT);
  const today = dayjs().format(DATE_TIME_FORMAT);
  const isBefore = dayjs(currentDate).isBefore(today);

  let backgroundColor = 'inherit';
  if (availableSlots) {
    const foundSlot = availableSlots.find((slot) => slot.date === currentDate);
    if (foundSlot) {
      backgroundColor = 'secondary.light';
      if (isBefore) {
        backgroundColor = 'reserved.light';
      }
    }
  }

  if (!schedules || schedules.length === 0) {
    return (
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{ backgroundColor }}
      />
    );
  }

  const currentSchedule = schedules.find(
    (schedule) => schedule.date === currentDate
  );
  const slotCount = currentSchedule ? currentSchedule.slots.length : 0;

  if (slotCount === 0) {
    return (
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{ backgroundColor }}
      />
    );
  }

  // Show markers for days in the future with booked slots.
  const badgeContent = slotCount > 0 && !isBefore ? slotCount : undefined;

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      color="success"
      badgeContent={badgeContent}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{ backgroundColor }}
      />
    </Badge>
  );
}

export default BuzyDay;
