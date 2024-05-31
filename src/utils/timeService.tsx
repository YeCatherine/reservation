/**
 * Prepare time slot period
 * @param timeSlot
 */
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
import { DATE_TIME_FORMAT } from '../consts';
import { Reservation } from '../types';

// dayjs.extend(utc);
// dayjs.extend(timezone);
import dayjs, { guessTZ } from './dayJs.ts';

export const prepareTimeSlotPeriod = (
  timeSlot: Reservation,
  timezone = guessTZ
) => {
  if (!timeSlot || !timeSlot.slot || !timeSlot.slot[0])
    return { preparedTimeSlotStart: null, preparedTimeSlotEnd: null };
  const preparedTimeSlotStartRaw = `${timeSlot.date} ${timeSlot.slot[0].start}`;
  const preparedTimeSlotEndRaw = `${timeSlot.date} ${timeSlot.slot[0].end}`;
  const preparedTimeSlotStart = dayjs(
    preparedTimeSlotStartRaw,
    DATE_TIME_FORMAT
  ).tz(timezone);
  const preparedTimeSlotEnd = dayjs(
    preparedTimeSlotEndRaw,
    DATE_TIME_FORMAT
  ).tz(timezone);
  return { preparedTimeSlotStart, preparedTimeSlotEnd };
};
