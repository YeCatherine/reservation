import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TimeSlot } from '../../../types';
import {
  getProviderAvailability,
  getProvidersAvailabilityForExactDay,
} from '../../../utils/providersService';
import { useAuth } from '../../Auth/context/AuthContext';
import { useDay } from '../../Calendar/context/DayContext';
import { Role } from '../../../consts';

interface ProviderContextProps<T> {
  currentProvider: T;
  setCurrentProvider: (provider: T) => void;
  availableSlots: TimeSlot[];
  setAvailableSlots: (slots: TimeSlot[]) => void;
  currentDaySlots: TimeSlot;
  setCurrentDaySlots: (slots: TimeSlot) => void;
}

const ProviderContext = createContext<ProviderContextProps<any> | undefined>(
  undefined
);

/**
 * ProviderContextProvider component
 *
 * A context provider for managing provider-related state.
 *
 * @param {ReactNode} children - React Child components.
 * @returns {JSX.Element} The rendered component.
 */
export const ProviderContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentProvider, setCurrentProvider] = useState<number | 'provider1'>(
    'provider1'
  );
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>(null);
  const [currentDaySlots, setCurrentDaySlots] = useState<TimeSlot>([]);

  const { user } = useAuth();
  const { selectedDate } = useDay();

  useEffect(() => {
    // Set current provider as current user id if they are a provider.
    if (
      user &&
      user.role === Role.Provider &&
      user.id &&
      currentProvider !== user.id
    ) {
      setCurrentProvider(user.id);
    }
  }, [user, currentProvider]);

  useEffect(() => {
    /**
     * Fetch provider availability data.
     */
    async function getData() {
      const providersAvailability =
        await getProviderAvailability(currentProvider);
      setAvailableSlots(providersAvailability);

      const exactDay = getProvidersAvailabilityForExactDay(
        providersAvailability,
        selectedDate.format('YYYY-MM-DD')
      );

      console.log(exactDay);
      setCurrentDaySlots(exactDay);
    }

    getData();
  }, [user, currentProvider, selectedDate]);

  return (
    <ProviderContext.Provider
      value={{
        currentProvider,
        setCurrentProvider,
        availableSlots,
        setAvailableSlots,
        currentDaySlots,
        setCurrentDaySlots,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};

export const ALL_PROVIDERS = 'provider1';

/**
 * useProvider hook
 *
 * A hook to use the provider context.
 *
 * @param {T} defaultValue - The default value for the provider.
 * @returns {ProviderContextProps<T>} The provider context.
 */
export const useProvider = <T,>(defaultValue: T) => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error(
      'useProvider must be used within a ProviderContextProvider'
    );
  }
  return {
    currentProvider: context.currentProvider as T,
    setCurrentProvider: context.setCurrentProvider as (provider: T) => void,
    availableSlots: context.availableSlots,
    setAvailableSlots: context.setAvailableSlots,
    currentDaySlots: context.currentDaySlots,
    setCurrentDaySlots: context.setCurrentDaySlots,
  };
};
