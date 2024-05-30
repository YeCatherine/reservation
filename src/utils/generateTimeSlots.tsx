import { Provider, Reservation, Slot } from '../types';
import dayjs from 'dayjs';
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  ReservationStatus,
  TOOLTIP_TEXTS,
} from '../consts';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { fetchReservations } from './reservationService.tsx';

dayjs.extend(utc);
dayjs.extend(timezone);

const guessTZ = dayjs.tz.guess();

/**
 * Generate client-specific time slots for a given day.
 * @param providers - Array of availableProviders.
 * @param date - The date for which to generate slots.
 * @returns Array of time slots.
 */
export async function generateClientTimeSlotsForDay(
  providers: Provider[],
  date: string,
  reservations: Reservation[]
): Slot[] {
  const todaysBookedSlots = await fetchReservations(date);

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
  const availabilityMap = new Map<string, Reservation>();

  providers.forEach((provider) => {
    const availability = provider.availability.find((av) => av.date === date);
    if (availability) {
      availabilityMap.set(provider.id, availability);
    }
  });

  const result: Slot[] = [];
  const providerIds = Array.from(availabilityMap.keys());

  if (providerIds.length === 0) {
    return result; // No availableProviders available on the given date
  }

  const commonAvailability = availabilityMap.get(providerIds[0]) as Slot;
  if (!commonAvailability) {
    return result; // No common availability found
  }

  const intervals = generateIntervals(
    commonAvailability.start,
    commonAvailability.end
  );

  intervals.forEach(([start, end]) => {
    const timeSlot: Slot = {
      start,
      end,
      status: 'available',
      availableProviders: [],
    };

    providerIds.forEach((providerId) => {
      const availability = availabilityMap.get(providerId);
      if (!availability) return;

      if (timeSlot.availableProviders) {
        timeSlot.availableProviders.push(providerId);
      } else {
        timeSlot.availableProviders = [providerId];
      }
    });
    const currentDay = dayjs(date);

    const { isDisabled, isBooked, isReserved, tooltipText } = getSlotStatus(
      timeSlot,
      todaysBookedSlots,
      currentDay,
      reservations
    );

    if (isDisabled) {
      timeSlot.status = ReservationStatus.DISABLED;
    }
    if (isBooked) {
      timeSlot.status = ReservationStatus.BOOKED;
    }
    if (isReserved) {
      timeSlot.status = ReservationStatus.RESERVED;
    }

    timeSlot.tooltipText = tooltipText;

    if (
      (timeSlot.availableProviders && timeSlot.availableProviders.length > 0) ||
      timeSlot.status !== ReservationStatus.AVAILABLE
    ) {
      result.push(timeSlot);
    }
  });
  return result;
}

/**
 * Get the status of a slot.
 * @param {Object} slot - The time slot object.
 * @returns {Object} The status and tooltip text for the slot.
 */
export const getSlotStatus = (
  slot: Slot,
  todaysBookedSlots,
  selectedDate,
  reservations
) => {
  const bookedSlot = todaysBookedSlots?.find(
    (booked) => booked.slot.start === slot.start && booked.slot.end === slot.end
  );
  const currentTime = dayjs().tz(guessTZ);
  const next24Hours = currentTime.add(24, 'hours');

  const slotStart = dayjs.tz(
    `${selectedDate.format(DATE_FORMAT)} ${slot.start}`,
    DATE_TIME_FORMAT,
    guessTZ
  );
  const disabled = slotStart.isBefore(next24Hours);

  if (disabled) {
    return { isDisabled: true, tooltipText: 'Please book in 24 hours ahead' };
  }

  if (bookedSlot) {
    switch (bookedSlot.status) {
      case ReservationStatus.BOOKED:
        return {
          isBooked: true,
          status: ReservationStatus.BOOKED,
          tooltipText: TOOLTIP_TEXTS.BOOKED,
        };

      case ReservationStatus.RESERVED:
        return {
          isReserved: true,
          status: ReservationStatus.RESERVED,
          tooltipText: TOOLTIP_TEXTS.RESERVED,
        };

      case ReservationStatus.DISABLED:
        return {
          isDisabled: true,
          status: ReservationStatus.DISABLED,
          tooltipText: TOOLTIP_TEXTS.DISABLED,
        };

      case ReservationStatus.AVAILABLE:
        return {
          isAvailable: true,
          status: ReservationStatus.AVAILABLE,
          tooltipText: TOOLTIP_TEXTS.AVAILABLE,
        };
      default:
        return {};
    }
  }

  if (
    reservations?.find(
      (reserved) =>
        reserved.slot.start === slot.start && reserved.slot.end === slot.end
    )
  ) {
    return { isReserved: true, tooltipText: 'Reserved' };
  }
  return {};
};
