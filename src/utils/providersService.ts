import axios from 'axios';
import { Reservation } from '../types';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { DATE_TIME_FORMAT } from '../consts';
type TProvidersArray = Record<string, Reservation[]>;

/**
 * Merge provider dates
 */
function mergeProviderData(providers: TProvidersArray) {
  const mergedDates = {};

  Object.values(providers)
    .flat()
    .forEach((slot) => {
      const { date, timezone, start, end } = slot;
      if (!mergedDates[date]) {
        mergedDates[date] = [];
      }
      mergedDates[date].push({ timezone, start, end });
    });

  return Object.entries(mergedDates).map(([date, slot]) => ({ date, slot }));
}

export const getProviderAvailability = async (
  providerId: string | null
): Promise<Reservation[] | null> => {
  try {
    if (!providerId) return null;

    const response = await axios.get(
      `/api/providers/${providerId}/availability`
    );
    const data = response.data as TProvidersArray;

    // Sort the data by date.
    const response2 = mergeProviderData(data).sort((a, b) =>
      dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
    ) as Reservation[];

    return response2;
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return null; // Return null or some default value in case of error
  }
};

/**
 * Update provider availability
 * @param providerId
 * @param availability
 */
export async function updateProvidersAvailability(
  providerId: string,
  availability
): Promise<Reservation[] | null> {
  try {
    const response = await axios.post(
      `/api/providers/${providerId}/availability`,
      availability
    );
    const data = response.data as TProvidersArray;

    toast('Availability submitted successfully');
    const response2 = mergeProviderData(data).sort((a, b) =>
      dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
    ) as Reservation[];
    console.log('update:', response.data, response2);
    return response2;
  } catch (error) {
    console.error('Error submitting availability:', error);
    toast.error('Error submitting availability');
    return null;
  }
}

export function getProvidersAvailabilityForExactDay(
  availability: Reservation[],
  date: string
): Reservation | null {
  if (!availability || !Array.isArray(availability)) return null;

  const result: Reservation | undefined = availability.find(
    (slot) => slot.date === date
  );

  if (!result || result === undefined) return null;

  // Prepare start and end date.
  result.start = dayjs(`${result.date} ${result.start}`, DATE_TIME_FORMAT);
  result.end = dayjs(`${result.date} ${result.end}`, DATE_TIME_FORMAT);

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

export const fetchProviders = async () => {
  try {
    const response = await axios.get('/api/providers');
    return response.data;

    // setSchedules(preparedSchedule);
  } catch (error) {
    console.error('Error fetching providers:', error);
  }
};
