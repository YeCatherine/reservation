// DayContext.tsx
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const guessTZ = dayjs.tz.guess();

interface CurrentDayContextType {
  selectedDate: Dayjs;
  setSelectedDate: (day: Dayjs) => void;
  selectedTimezone: string;
  setSelectedTimezone: Dispatch<SetStateAction<string>>;
}

type TimeZoneContextType = {
  selectedTimezone: string;
  setSelectedTimezone: Dispatch<SetStateAction<string>>;
};

const DayContext = createContext<CurrentDayContextType | undefined>(undefined);

export const useDay = (): CurrentDayContextType => {
  const context = useContext(DayContext);
  if (!context) {
    throw new Error('useDay must be used within a DayProvider');
  }
  return context;
};

interface CurrentDayProviderProps {
  children: ReactNode;
}

export const DayProvider: React.FC<CurrentDayProviderProps> = ({
  children,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(
    dayjs().add(1, 'day').startOf('day')
  );

  const [selectedTimezone, setSelectedTimezone] = useState<string>(guessTZ);

  // Optional: Update the current day at midnight
  useEffect(() => {
    const now = dayjs();
    const msUntilMidnight = now.endOf('day').diff(now, 'millisecond') + 1;
    const timeoutId = setTimeout(
      () => setSelectedDate(dayjs()),
      msUntilMidnight
    );

    return () => clearTimeout(timeoutId);
  }, [selectedDate]);

  return (
    <DayContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        selectedTimezone,
        setSelectedTimezone,
      }}
    >
      {children}
    </DayContext.Provider>
  );
};
export default DayProvider;
