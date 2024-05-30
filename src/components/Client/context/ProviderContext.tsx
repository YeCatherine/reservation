import React, {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Provider, Reservation, Slot } from '../../../types';
import {
  fetchProviders,
  getProviderAvailability,
  getProvidersAvailabilityForExactDay,
} from '../../../utils/providersService';
import { useAuth } from '../../Auth/context/AuthContext';
import { useDay } from '../../Calendar/context/DayContext';
import { DATE_FORMAT, Role } from '../../../consts';
import { ALL_PROVIDERS } from '../../../consts';

interface ProviderContextProps<T> {
  currentProvider: T;
  setCurrentProvider: (provider: T) => void;
  availableSlots: Reservation[] | null;
  setAvailableSlots: (slots: Reservation[] | null) => void;
  currentDaySlots: Slot;
  setCurrentDaySlots: (slots: Slot) => void;
  providers: Provider[];
}

// eslint-disable-next-line
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
  const [currentProvider, setCurrentProvider] = useState<string>(ALL_PROVIDERS);
  const [availableSlots, setAvailableSlots] = useState<Reservation[] | null>(
    null
  );
  const [currentDaySlots, setCurrentDaySlots] = useState<Slot>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const { user } = useAuth();
  const { selectedDate } = useDay();

  const fetchProvidersData = useCallback(async () => {
    try {
      const data = await fetchProviders();
      setProviders(data);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
  }, []);

  const fetchProviderAvailability = useCallback(async () => {
    try {
      const providersAvailability =
        await getProviderAvailability(currentProvider);

      setAvailableSlots(providersAvailability);

      const exactDay = getProvidersAvailabilityForExactDay(
        providersAvailability,
        selectedDate.format(DATE_FORMAT)
      );
      setCurrentDaySlots(exactDay);
    } catch (error) {
      console.error('Failed to fetch provider availability:', error);
    }
  }, [currentProvider, selectedDate]);

  useEffect(() => {
    fetchProvidersData();
  }, [fetchProvidersData]);

  useEffect(() => {
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
    fetchProviderAvailability();
  }, [fetchProviderAvailability]);

  return (
    <ProviderContext.Provider
      value={{
        currentProvider,
        setCurrentProvider,
        availableSlots,
        setAvailableSlots,
        currentDaySlots,
        setCurrentDaySlots,
        providers,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};

/**
 * useProvider hook
 *
 * A hook to use the provider context.
 *
 * @returns {ProviderContextProps<T>} The provider context.
 */
// eslint-disable-next-line
export const useProvider = <T,>() => {
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
    providers: context.providers,
  };
};
