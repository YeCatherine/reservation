import { Schedule, Slot } from '../types';
import dayjs, { Dayjs } from 'dayjs';
import { DATE_TIME_FORMAT, SlotState, TOOLTIP_TEXTS } from '../consts';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Generate time slots for a given timezone.
 * @param {string} selectedTimezone - The timezone in which to generate slots.
 * @param {number | Dayjs} scheduleStartTime - Start of the working day in hours (default 8 AM).
 * @param {number | Dayjs} scheduleEndTime - End of the working day in hours (default 6 PM).
 * @param {Slot[]} selectedDateSlots - Array of selected date slots to compare against.
 * @returns {Slot[]} Array of time slots.
 */
export const generateTimeSlots = (
  selectedTimezone: string,
  scheduleStartTime: number | Dayjs = 8,
  scheduleEndTime: number | Dayjs = 18,
  selectedDateSlots: Slot[] = []
): Slot[] => {
  const slots: Slot[] = [];

  let currentTime: Dayjs;
  let endTime: Dayjs;

  if (Number.isInteger(scheduleStartTime)) {
    currentTime = dayjs
      .tz()
      .startOf('day')
      .hour(scheduleStartTime as number)
      .tz(selectedTimezone);
  } else {
    currentTime = (scheduleStartTime as Dayjs).tz(selectedTimezone);
  }

  if (Number.isInteger(scheduleEndTime)) {
    endTime = dayjs
      .tz()
      .startOf('day')
      .hour(scheduleEndTime as number)
      .tz(selectedTimezone);
  } else {
    endTime = (scheduleEndTime as Dayjs).tz(selectedTimezone);
  }

  if (!currentTime.isValid() || !endTime.isValid()) {
    throw new Error('Invalid time range');
  }

  while (currentTime.isBefore(endTime)) {
    const endSlot = currentTime.add(15, 'minute');
    const isSelected = selectedDateSlots.some(
      (s) =>
        s.start === currentTime.format('HH:mm') &&
        s.end === endSlot.format('HH:mm')
    );

    slots.push({
      start: currentTime.format('HH:mm'),
      end: endSlot.format('HH:mm'),
      disabled: false,
      selected: isSelected,
    });
    currentTime = endSlot;
  }
  return slots;
};

/**
 * Generate client-specific time slots for a selected date and timezone.
 * @param {Dayjs} selectedDate - The date for which to generate slots.
 * @param {Schedule[]} schedules - Array of schedules.
 * @param {string} selectedTimezone - The timezone for the selected date.
 * @returns {Slot[]} Array of time slots.
 */
export const generateClientTimeSlots = (
  selectedDate: Dayjs,
  schedules: Schedule[] = [],
  selectedTimezone: string
): Slot[] => {
  const selectedDateStr = selectedDate.format(DATE_TIME_FORMAT);
  const schedule = schedules.find((s) => s.date === selectedDateStr);

  if (!schedule) return [];

  const currentTime = dayjs().tz(selectedTimezone);
  const next24Hours = currentTime.add(24, 'hours');

  return schedule.slots.map((slot) => {
    const slotStart = dayjs.tz(
      `${schedule.date} ${slot.start}`,
      'YYYY-MM-DD HH:mm',
      selectedTimezone
    );
    const disabled = slotStart.isBefore(next24Hours);
    const state = disabled
      ? SlotState.Disabled
      : slot.booked
        ? SlotState.Booked
        : slot.reserved
          ? SlotState.Reserved
          : SlotState.Available;

    const toolTipText = disabled
      ? TOOLTIP_TEXTS.DISABLED
      : slot.reserved
        ? TOOLTIP_TEXTS.RESERVED
        : slot.booked
          ? TOOLTIP_TEXTS.BOOKED
          : TOOLTIP_TEXTS.AVAILABLE;

    return {
      ...slot,
      disabled: state !== SlotState.Available,
      tooltip: toolTipText,
      state: state,
    };
  });
};
