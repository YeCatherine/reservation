import axios from 'axios';
import { Reservation } from '../types';

/**
 * Fetch all reservations.
 * @returns {Promise<Reservation[]>} A promise that resolves to an array of reservations.
 */
export const fetchReservations = async (date = ''): Promise<Reservation[]> => {
  let response;
  if (date === '') {
    response = await axios.get(`/api/reservations`);
  } else {
    response = await axios.get(`/api/reservations?date=${date}`);
  }
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
