import axios from 'axios';
import { Availability, Slot } from '../types';
import dayjs from 'dayjs';

import { toast } from 'react-toastify';

export const getProviderAvailability = async (providerId) => {
  try {
    if (!providerId) return null;

    const response = await fetch(`/api/providers/${providerId}/availability`);
    const data = await response.json();

    // Sort the data by date.
    return data.sort((a, b) => (dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1));
    // prepare start and end date.
    return sorted.map((slot) => {
      return {
        ...slot,
        start: dayjs(`${slot.date} ${slot.start}`, 'YYYY-MM-DD HH:mm'),
        end: dayjs(`${slot.date} ${slot.end}`, 'YYYY-MM-DD HH:mm'),
      };
    });
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return null; // Return null or some default value in case of error
  }
};

export async function updateProvidersAvailability(providerId, availability) {
  try {
    const response = await axios.post(
      `/api/providers/${providerId}/availability`,
      availability
    );
    toast('Availability submitted successfully');
    return response.data;
  } catch (error) {
    console.error('Error submitting availability:', error);
    toast.error('Error submitting availability');
    return null;
  }
}

export interface Availability {
  date: string;
  start: string;
  end: string;
  timezone?: string;
  timeSlots: Slot[];

  selectedDays?: boolean[];
}

export function getProvidersAvailabilityForExactDay(
  availability: Availability[],
  date: string
): Availability | null {
  if (!availability || !Array.isArray(availability)) return null;
  const result: Availability | undefined = availability.find(
    (slot) => slot.date === date
  );
  if (!result || result === undefined) return null;

  // Prepare start and end date.

  result.start = dayjs(`${result.date} ${result.start}`, 'YYYY-MM-DD HH:mm');
  result.end = dayjs(`${result.date} ${result.end}`, 'YYYY-MM-DD HH:mm');
  // result.date = dayjs(result.date, 'YYYY-MM-DD');
  return result;
}

export function deleteProviderAvailability(providerId, date) {
  try {
    axios.delete(`/api/providers/${providerId}/availability/${date}`);
    toast('Availability deleted successfully');
  } catch (error) {
    console.error('Error deleting availability:', error);
    toast.error('Error deleting availability');
  }
}

export const fetchProviders = async (setProviders, setSchedules) => {
  try {
    const response = await axios.get('/api/providers');
    setProviders(response.data);

    const preparedSchedule = response.data
      .reduce((acc, provider) => {
        provider.schedules.forEach((schedule) => {
          const found = acc.find((item) => item.date === schedule.date);
          if (found) {
            found.slots = [...found.slots, ...schedule.slots];
          } else {
            acc.push({ ...schedule });
          }
        });
        return acc;
      }, [])
      .map((item) => ({
        ...item,
        slots: item.slots.filter(
          (slot, index, self) =>
            index ===
            self.findIndex((s) => s.start === slot.start && s.end === slot.end)
        ),
      }));

    setSchedules(preparedSchedule);
  } catch (error) {
    console.error('Error fetching providers:', error);
  }
};
