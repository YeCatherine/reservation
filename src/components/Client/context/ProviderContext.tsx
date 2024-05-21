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
} from '../../../utils/providersAvailability';
import { useAuth } from '../../Auth/context/AuthContext.tsx';
import { useDay } from '../../Calendar/context/DayContext.tsx';
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
    // Set current provider as current user id in case if he is provider..
    if (
      user &&
      user.role === Role.Provider &&
      user.id &&
      currentProvider !== user.id
    ) {
      setCurrentProvider(user.id);
    }
  }, [user]);

  useEffect(() => {
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
      // if (exactDay) {
      //   // debugger;
      //   setTimeSlots({
      //     start: dayjs(
      //       `${exactDay.date} ${exactDay.start}`,
      //       "YYYY-MM-DD HH:mm"
      //     ),
      //     end: dayjs(`${exactDay.date} ${exactDay.end}`, "YYYY-MM-DD HH:mm"),
      //   });
      // }
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
