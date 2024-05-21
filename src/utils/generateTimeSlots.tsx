import { Availability, Provider, Schedule, Slot, TimeSlot } from '../types';
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
  selectedDate: dayjs.Dayjs,
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

/**
 * Generate client-specific time slots for a given day.
 * @param providers - Array of availableProviders.
 * @param date - The date for which to generate slots.
 * @returns Array of time slots.
 */
export function generateClientTimeSlotsForDay(
  providers: Provider[],
  date: string
): TimeSlot[] {
  // Helper function to add minutes to a time string
  const addMinutes = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(mins + minutes);
    return date.toTimeString().slice(0, 5);
  };

  // Generate all 15-minute time slots in a day
  const generateIntervals = (start: string, end: string): string[][] => {
    const intervals: string[][] = [];
    let current = start;
    while (current < end) {
      const next = addMinutes(current, 15);
      intervals.push([current, next]);
      current = next;
    }
    return intervals;
  };

  // Find availability and schedules for the given date
  const availabilityMap = new Map<string, Availability>();
  const scheduleMap = new Map<string, Schedule>();

  providers.forEach((provider) => {
    const availability = provider.availability.find((av) => av.date === date);
    if (availability) {
      availabilityMap.set(provider.id, availability);
    }
    const schedule = provider.schedules.find((sch) => sch.date === date);
    if (schedule) {
      scheduleMap.set(provider.id, schedule);
    }
  });

  const result: TimeSlot[] = [];
  const providerIds = Array.from(availabilityMap.keys());

  if (providerIds.length === 0) {
    return result; // No availableProviders available on the given date
  }

  const commonAvailability = availabilityMap.get(providerIds[0]);
  if (!commonAvailability) {
    return result; // No common availability found
  }

  const intervals = generateIntervals(
    commonAvailability.start,
    commonAvailability.end
  );

  intervals.forEach(([start, end]) => {
    const timeSlot: TimeSlot = {
      start,
      end,
      status: 'available',
      availableProviders: [],
    };

    providerIds.forEach((providerId) => {
      const availability = availabilityMap.get(providerId);
      if (!availability) return;

      const schedule = scheduleMap.get(providerId);
      const slot = schedule?.slots.find(
        (slot) => slot.start === start && slot.end === end
      );

      if (slot?.booked) {
        timeSlot.status = 'booked';
      } else if (slot?.reserved) {
        timeSlot.status = 'reserved';
      } else {
        timeSlot.availableProviders.push(providerId);
      }
    });

    if (
      timeSlot.availableProviders.length > 0 ||
      timeSlot.status !== 'available'
    ) {
      result.push(timeSlot);
    }
  });

  return result;
}
