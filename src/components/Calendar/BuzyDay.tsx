import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import { DATE_FORMAT } from '../../consts';
import { Reservation } from '../../types';
import { useProvider } from '../Client/context/ProviderContext';

/**
 * BuzyDay component
 *
 * Shows a badge with the number of slots available for a given day.
 *
 * @param {PickersDayProps<Dayjs> & { schedules?: Reservation[] }} props - Component props.
 * @returns {JSX.Element} The rendered component.
 */
export function BuzyDay(
  props: PickersDayProps<Dayjs> & { schedules?: Reservation[] }
): JSX.Element {
  const { day, outsideCurrentMonth, schedules = [], ...other } = props;
  const { availableSlots } = useProvider();

  const currentDate = day.format(DATE_FORMAT);
  const today = dayjs().format(DATE_FORMAT);
  let backgroundColor = 'inherit';
  const isBefore = dayjs(currentDate).isBefore(today);

  if (availableSlots) {
    const foundSlot: Reservation | undefined = availableSlots.find((slot) => {
      return slot.date && slot.date === currentDate;
    });
    if (foundSlot) {
      backgroundColor = 'secondary.light';
    }
    if (isBefore && foundSlot) {
      backgroundColor = 'reserved.light';
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
  ) as Reservation | undefined;
  const slotCount =
    currentSchedule && currentSchedule.slots ? currentSchedule.slots.length : 0;

  if (slotCount === 0) {
    return (
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        sx={{ backgroundColor }}
        day={day}
      />
    );
  }

  return (
    <PickersDay
      {...other}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
      sx={{ backgroundColor }}
    />
  );
}

export default BuzyDay;
