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
import { useAuth } from '../../Auth/context/AuthContext.tsx';
import { ReservationStatus } from '../../../consts';

interface ReservationContextProps {
  timer: number | null;
  setTimer: (timer: number | null) => void;
  reservation: Reservation;
  setReservation: (reservation: Reservation) => void;
  reservations: Reservation[];
  // fetchUserReservations: () => void;
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

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reservation, setReservation] = useState<Reservation[]>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const { user } = useAuth();

  const fetchUserReservations = async () => {
    if (user) {
      const fetchedReservations = await fetchReservations();
      setReservations(
        fetchedReservations.filter((res) => res.clientId === user.id)
      );
    }
  };

  const createNewReservation = async (
    newReservation: Omit<Reservation, 'id'>
  ): Promise<Reservation> => {
    const reservation = await createReservation(newReservation);
    setReservations((prev) => [...prev, reservation]);
    // Set Current reservation.
    setReservation(reservation);
    return reservation;
  };

  const updateExistingReservation = async (
    id: number,
    updatedFields: Partial<Reservation>
  ): Promise<Reservation> => {
    const updatedReservation = await updateReservation(id, updatedFields);
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? updatedReservation : res))
    );
    if (reservation.id === id) {
      // If reservation is confirmed, remove it from the context.
      if (
        updatedFields.status === ReservationStatus.CONFIRMED ||
        updatedFields.status === ReservationStatus.EXPIRED
      ) {
        setReservation(null);
      } else {
        // Update reservation in context.
        setReservation(updatedReservation);
      }
    }

    return updatedReservation;
  };

  /**
   * Remove current reservation and remove it from databsase when timer is up.
   */
  useEffect(() => {
    if (timer === 0 && reservation) {
      removeReservation(reservation.id);
    }
  }, [timer]);

  const removeReservation = async (id: number): Promise<void> => {
    await deleteReservation(id);
    if (reservation.id === id) setReservation(null);
    setReservations((prev) => prev.filter((res) => res.id !== id));
  };

  useEffect(() => {
    fetchUserReservations();
  }, [user]);

  return (
    <ReservationContext.Provider
      value={{
        reservation,
        reservations,
        timer,
        setTimer,
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

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error(
      'useReservations must be used within a ReservationProvider'
    );
  }
  return context;
};
