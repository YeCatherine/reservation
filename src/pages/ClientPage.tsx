import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { Reservation, Schedule } from '../types';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DATE_TIME_FORMAT, DEFAULT_TIMER, ReservationStatus } from '../consts';
import { Provider, Slot } from '../types';
import SelectTimeSlots from '../components/Client/SelectTimeSlots';
import { useAuth } from '../components/Auth/context/AuthContext';
import {
  ALL_PROVIDERS,
  useProvider,
} from '../components/Client/context/ProviderContext';
import { SelectProvidersSection } from '../components/Client/SelectProvidersSection';
import { ReservationSubmit } from '../components/Reservations/ReservationSubmit';
import { generateClientTimeSlotsForDay } from '../utils/generateTimeSlots';
import PageLayout from '../components/ui/PageLayout';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { SelectProvider } from '../components/Client/SelectProvider';
import { CommonCalendar } from '../components/Calendar/CommonCalendar';
import { useDay } from '../components/Calendar/context/DayContext';
import {
  createReservation,
  fetchReservations,
} from '../utils/reservationService';
import { fetchProviders } from '../utils/providersService.ts';
import Reservations from '../components/Reservations/Reservation';
import { useReservations } from '../components/Reservations/context/ReservationContext';

dayjs.extend(utc);
dayjs.extend(timezone);

const guessTZ = dayjs.tz.guess();

/**
 * ClientPage component for scheduling reservations.
 */
const ClientPage: React.FC = () => {
  const { user } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [currentSelectedSlot, setCurrentSelectedSlot] = useState<Slot | null>(
    null
  );
  const {
    reservation,
    createNewReservation,
    removeReservation,
    timer,
    setTimer,
  } = useReservations();
  const { currentProvider, setCurrentProvider, currentDaySlots } = useProvider<
    number | 'provider1'
  >(ALL_PROVIDERS);
  const { selectedDate, selectedTimezone } = useDay();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [availableClientSlots, setAvailableClientSlots] = useState<Slot[]>([]);
  const [todaysBookedSlots, setTodaysBookedSlots] = useState<Reservation[]>([]);

  /**
   * @brief Fetches today's booked slots on component mount.
   */
  useEffect(() => {
    (async () => {
      const response = await fetchReservations();
      setTodaysBookedSlots(response);
    })();
  }, []);

  /**
   * @brief Generates available client slots for the selected day.
   */
  useEffect(() => {
    const availableClientSlotsResponse = generateClientTimeSlotsForDay(
      providers,
      selectedDate.format('YYYY-MM-DD')
    );
    setAvailableClientSlots(availableClientSlotsResponse);
  }, [providers, selectedDate, currentProvider, selectedTimezone]);

  /**
   * @brief Fetches providers and their schedules on component mount.
   */
  useEffect(() => {
    fetchProviders(setProviders, setSchedules);
  }, []);

  /**
   * @brief Handles the before unload event to warn the user about unsaved changes.
   */
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (currentSelectedSlot) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentSelectedSlot]);

  /**
   * @brief Handles the click event on a time slot.
   * @param slot The selected slot.
   */
  const handleSlotClick = (slot: Slot) => {
    if (!slot.disabled && !slot.reserved) {
      if (reservation) {
        removeReservation(reservation.id);
        setTimer(null);
      }
      setTimer(DEFAULT_TIMER * 60);

      if (intervalId) {
        clearInterval(intervalId);
      }

      const newIntervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev !== null && prev > 0) {
            return prev - 1;
          } else {
            clearInterval(newIntervalId);
            return null;
          }
        });
      }, 1000);

      let selectedProvider = null;
      if (slot.availableProviders.length === 1) {
        selectedProvider = slot.availableProviders[0];
      }

      const newSubmittedSchedule: Reservation = {
        clientId: user?.id || null,
        date: selectedDate.format(DATE_TIME_FORMAT),
        slot: slot,
        timer: timer,
        status: ReservationStatus.PENDING,
        providerId: selectedProvider,
      };

      createReservation(newSubmittedSchedule).then((reservation) => {
        createNewReservation(reservation);
      });

      setIntervalId(newIntervalId);

      if (currentProvider === ALL_PROVIDERS) {
        setCurrentProvider(null);
      }
    }
  };

  const title = 'Scheduling App';

  return (
    <PageLayout title={title}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid
          container
          spacing={{
            xs: 0,
            md: 2,
          }}
        >
          <Box
            flex={1}
            sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <SelectProvider providers={providers} />
            <CommonCalendar
              schedules={schedules}
              minDate={dayjs().startOf('day')}
            />
          </Box>
          <Grid item xs={12} md={8}>
            <SelectTimeSlots
              availableSlots={availableClientSlots}
              selectedSlot={currentSelectedSlot}
              todaysBookedSlots={todaysBookedSlots}
              handleSlotClick={handleSlotClick}
            />
            <SelectProvidersSection />
            <ReservationSubmit />
          </Grid>
        </Grid>
      </LocalizationProvider>
      <Box mt={4}>
        <Reservations />
      </Box>
    </PageLayout>
  );
};

export default ClientPage;
