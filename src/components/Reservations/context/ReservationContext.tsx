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

interface ReservationContextProps {
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
  const [reservations, setReservations] = useState<Reservation[]>([]);
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
    return updatedReservation;
  };

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
        // fetchUserReservations,
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
