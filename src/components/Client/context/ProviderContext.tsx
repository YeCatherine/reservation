import React, {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Provider, Slot } from '../../../types';
import {
  fetchProviders,
  getProviderAvailability,
  getProvidersAvailabilityForExactDay,
} from '../../../utils/providersService';
import { useAuth } from '../../Auth/context/AuthContext';
import { useDay } from '../../Calendar/context/DayContext';
import { DATE_FORMAT, Role } from '../../../consts';
import { ALL_PROVIDERS } from '../../../consts';

interface ProviderContextProps {
  currentProvider: string;
  setCurrentProvider: (provider: string) => void;
  availableSlots: Slot[];
  setAvailableSlots: (slots: Slot[]) => void;
  currentDaySlots: Slot[];
  setCurrentDaySlots: (slots: Slot[]) => void;
  providers: Provider[];
}

const ProviderContext = createContext<ProviderContextProps | undefined>(
    undefined
);

export const ProviderContextProvider: React.FC<{ children: ReactNode }> = ({
                                                                             children,
                                                                           }) => {
  const [currentProvider, setCurrentProvider] = useState<string>(ALL_PROVIDERS);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [currentDaySlots, setCurrentDaySlots] = useState<Slot[]>([]);
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
      const providersAvailability: Slot[] = await getProviderAvailability(currentProvider);
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

export const useProvider = () => {
  const context = useContext(ProviderContext);

  if (!context) {
    throw new Error('useProvider must be used within a ProviderContextProvider');
  }

  return context;
};
