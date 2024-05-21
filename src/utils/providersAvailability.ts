import axios from 'axios';
import { Availability, Provider, Schedule, Slot } from '../types';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

/**
 * Fetch the availability of a provider.
 *
 * @param {number | string} providerId - The ID of the provider.
 *
 * @returns {Promise<Availability[] | null>} The availability data sorted by date, or null if an error occurs.
 */
export const getProviderAvailability = async (
  providerId: number | string
): Promise<Availability[] | null> => {
  try {
    if (!providerId) return null;
    const response = await fetch(`/api/providers/${providerId}/availability`);
    const data = await response.json();
    return data.sort((a: Availability, b: Availability) =>
      dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
    );
  } catch (error) {
    console.error('Error fetching provider availability:', error);
    return null;
  }
};

/**
 * Update the availability of a provider.
 *
 * @param {number | string} providerId - The ID of the provider.
 * @param {Availability} availability - The availability data to update.
 *
 * @returns {Promise<Availability | null>} The updated availability data, or null if an error occurs.
 */
export const updateProvidersAvailability = async (
  providerId: number | string,
  availability: Availability
): Promise<Availability | null> => {
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
};

/**
 * Fetch the availability for a specific day.
 *
 * @param {Availability[]} availability - The availability data.
 * @param {string} date - The date to fetch availability for.
 *
 * @returns {Availability | null} The availability for the specific day, or null if not found.
 */
export const getProvidersAvailabilityForExactDay = (
  availability: Availability[],
  date: string
): Availability | null => {
  if (!availability || !Array.isArray(availability)) return null;
  const result = availability.find((slot) => slot.date === date);
  if (!result) return null;

  result.start = dayjs(
    `${result.date} ${result.start}`,
    'YYYY-MM-DD HH:mm'
  ).format();
  result.end = dayjs(
    `${result.date} ${result.end}`,
    'YYYY-MM-DD HH:mm'
  ).format();
  return result;
};

/**
 * Delete the availability of a provider for a specific date.
 *
 * @param {number | string} providerId - The ID of the provider.
 * @param {string} date - The date to delete availability for.
 */
export const deleteProviderAvailability = async (
  providerId: number | string,
  date: string
): Promise<void> => {
  try {
    await axios.delete(`/api/providers/${providerId}/availability/${date}`);
    toast('Availability deleted successfully');
  } catch (error) {
    console.error('Error deleting availability:', error);
    toast.error('Error deleting availability');
  }
};

/**
 * Fetch all providers and their schedules.
 *
 * @param {Function} setProviders - Function to set the providers state.
 * @param {Function} setSchedules - Function to set the schedules state.
 */
export const fetchProviders = async (
  setProviders: (providers: Provider[]) => void,
  setSchedules: (schedules: Schedule[]) => void
): Promise<void> => {
  try {
    const response = await axios.get('/api/providers');
    setProviders(response.data);

    const preparedSchedule = response.data
      .reduce((acc: Schedule[], provider: Provider) => {
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
