// src/components/Reservations/context/ReservationContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  createReservation,
  deleteReservation,
  fetchReservations,
  Reservation,
  updateReservation,
} from '../../../utils/reservationService';
import { useAuth } from '../../Auth/context/AuthContext';

interface ReservationContextProps {
  reservations: Reservation[];
  createNewReservation: (
    newReservation: Omit<Reservation, 'id'>
  ) => Promise<Reservation>;
  updateExistingReservation: (
    id: number,
    updatedFields: Partial<Reservation>
  ) => Promise<Reservation>;
  removeReservation: (id: number) => Promise<void>;
}

const ReservationContext = createContext<ReservationContextProps | undefined>(
  undefined
);

/**
 * ReservationProvider component
 *
 * A context provider for managing reservations.
 *
 * @param {ReactNode} children - Child components
 * @returns {JSX.Element} The rendered component
 */
export const ReservationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { user } = useAuth();

  /**
   * Fetch reservations for the current user.
   */
  const fetchUserReservations = async () => {
    if (user) {
      const fetchedReservations = await fetchReservations();
      setReservations(
        fetchedReservations.filter((res) => res.clientId === user.id)
      );
    }
  };

  /**
   * Create a new reservation.
   */
  const createNewReservation = async (
    newReservation: Omit<Reservation, 'id'>
  ): Promise<Reservation> => {
    const reservation = await createReservation(newReservation);
    setReservations((prev) => [...prev, reservation]);
    return reservation;
  };

  /**
   * Update an existing reservation.
   * @param {number} id - The reservation ID
   * @param updatedFields - The updated reservation fields
   * @returns {Promise<Reservation>} The updated reservation
   */
  const updateExistingReservation = async (
    id: number,
    updatedFields: Partial<Reservation>
  ): Promise<Reservation> => {
    const updatedReservation = await updateReservation(id, updatedFields);
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? updatedReservation : res))
    );
    return updatedReservation;
  };

  /**
   * Remove a reservation.
   * @param {number} id - The reservation ID
   * @returns {Promise<void>}
   */
  const removeReservation = async (id: number): Promise<void> => {
    await deleteReservation(id);
    setReservations((prev) => prev.filter((res) => res.id !== id));
  };

  useEffect(() => {
    fetchUserReservations();
  }, [user]);

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        createNewReservation,
        updateExistingReservation,
        removeReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationProvider;

/**
 * useReservations hook
 *
 * A hook to use the reservation context.
 *
 * @returns {ReservationContextProps} The reservation context
 */
export const useReservations = (): ReservationContextProps => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error(
      'useReservations must be used within a ReservationProvider'
    );
  }
  return context;
};
