import axios from 'axios';
import dayjs from 'dayjs';
import { Reservation, Slot } from '../types';

/**
 * Fetch all reservations.
 * @returns {Promise<Reservation[]>} A promise that resolves to an array of reservations.
 */
export const fetchReservations = async (): Promise<Reservation[]> => {
  const response = await axios.get('/api/reservations');
  return response.data.reservations;
};

/**
 * Create a new reservation.
 * @param {Omit<Reservation, 'id'>} newReservation - The new reservation data without the ID.
 * @returns {Promise<Reservation>} A promise that resolves to the created reservation.
 */
export const createReservation = async (
  newReservation: Omit<Reservation, 'id'>
): Promise<Reservation> => {
  const response = await axios.post('/api/reservations', newReservation);
  return response.data.reservation;
};

/**
 * Update an existing reservation.
 * @param {number} id - The ID of the reservation to update.
 * @param {Partial<Reservation>} updatedFields - The fields to update.
 * @returns {Promise<Reservation>} A promise that resolves to the updated reservation.
 */
export const updateReservation = async (
  id: number,
  updatedFields: Partial<Reservation>
): Promise<Reservation> => {
  const response = await axios.patch(`/api/reservations/${id}`, updatedFields);
  return response.data.reservation;
};

/**
 * Delete a reservation.
 * @param {number} id - The ID of the reservation to delete.
 * @returns {Promise<void>} A promise that resolves when the reservation is deleted.
 */
export const deleteReservation = async (id: number): Promise<void> => {
  await axios.delete(`/api/reservations/${id}`);
};

/**
 * Format a date and time string.
 * @param {string} dateTime - The date and time string to format.
 * @returns {string} The formatted date and time string.
 */
export const formatDateTime = (dateTime: string): string => {
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm');
};

/**
 * Create a new time slot.
 * @param {string} start - The start time of the slot.
 * @param {string} end - The end time of the slot.
 * @returns {Slot} The created slot.
 */
export const createSlot = (start: string, end: string): Slot => {
  return {
    start,
    end,
    disabled: false,
    selected: false,
  };
};

/**
 * Update an existing time slot.
 * @param {Slot} slot - The slot to update.
 * @param {Partial<Slot>} updatedFields - The fields to update.
 * @returns {Slot} The updated slot.
 */
export const updateSlot = (slot: Slot, updatedFields: Partial<Slot>): Slot => {
  return { ...slot, ...updatedFields };
};
