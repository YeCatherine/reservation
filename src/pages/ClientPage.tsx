import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { Reservation } from '../types';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DATE_FORMAT, DEFAULT_TIMER, ReservationStatus } from '../consts';
import { Slot } from '../types';
import SelectTimeSlots from '../components/Client/SelectTimeSlots.tsx';
import { useAuth } from '../components/Auth/context/AuthContext.tsx';
import { useProvider } from '../components/Client/context/ProviderContext.tsx';
import { ALL_PROVIDERS } from '../consts';
import { SelectProvidersSection } from '../components/Client/SelectProvidersSection.tsx';
import { ReservationSubmit } from '../components/Reservations/ReservationSubmit.tsx';
import { generateClientTimeSlotsForDay } from '../utils/generateTimeSlots.tsx';
import PageLayout from '../components/ui/PageLayout.tsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { SelectProvider } from '../components/Client/SelectProvider.tsx';
import { CommonCalendar } from '../components/Calendar/CommonCalendar.tsx';
import { useDay } from '../components/Calendar/context/DayContext.tsx';
import { createReservation } from '../utils/reservationService.tsx';
import Reservations from '../components/Reservations/Reservation.tsx';
import { useReservations } from '../components/Reservations/context/ReservationContext.tsx';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * ClientPage component for scheduling reservations.
 */
const ClientPage: React.FC = () => {
  const { user } = useAuth();

  const [currentSelectedSlot, setCurrentSelectedSlot] = useState<Slot | null>(
    null
  );

  const {
    reservation,
    reservations,
    createNewReservation,
    removeReservation,
    timer,
    setTimer,
  } = useReservations();

  const { currentProvider, setCurrentProvider, providers } = useProvider();
  const { selectedDate, selectedTimezone } = useDay();
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [availableClientSlots, setAvailableClientSlots] = useState<
    Slot[] | null
  >(null);

  /**
   * @brief Generates available client slots for the selected day.
   */
  useEffect(() => {
    (async () => {
      // Filter providers list.
      let filteredProviders;
      if (currentProvider === ALL_PROVIDERS) {
        filteredProviders = providers;
      } else {
        filteredProviders = providers.filter(
          (provider) => provider.id === currentProvider
        );
      }

      const data = await generateClientTimeSlotsForDay(
        filteredProviders,
        selectedDate.format(DATE_FORMAT),
        reservations,
        selectedTimezone
      );

      setAvailableClientSlots(data);
    })();
  }, [
    providers,
    selectedDate,
    currentProvider,
    selectedTimezone,
    reservations,
  ]);

  useEffect(() => {
    // Clear the selected slot when the date changes.
    setCurrentSelectedSlot(null);
  }, [selectedDate]);

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
    console.log('slot', slot);
    if (
      slot.status !== ReservationStatus.RESERVED &&
      slot.status !== ReservationStatus.DISABLED
    ) {
      if (reservation) {
        removeReservation(reservation.id);
        setTimer(null);
      }
      setCurrentSelectedSlot(slot);
      setTimer(DEFAULT_TIMER * 60);

      if (intervalId) {
        clearInterval(intervalId);
      }

      let timerValue = timer;
      const newIntervalId = setInterval(() => {
        if (timerValue !== null && timerValue > 0) {
          timerValue -= 1;
          setTimer(timerValue);
        } else {
          clearInterval(newIntervalId);
          setCurrentSelectedSlot(null);
          setTimer(null);
        }
      }, 1000);

      let selectedProvider = null;
      if (slot.availableProviders.length === 1) {
        selectedProvider = slot.availableProviders[0];
        setCurrentProvider(selectedProvider);
      }

      const newSubmittedSchedule: Reservation = {
        clientId: user?.id || null,
        date: selectedDate.format(DATE_FORMAT),
        slot: slot,
        timer: timer,
        status: ReservationStatus.RESERVED,
        providerId: selectedProvider,
      };

      createReservation(newSubmittedSchedule).then((reservation) => {
        createNewReservation(reservation);
      });

      setIntervalId(newIntervalId);
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
            <SelectProvider />
            <CommonCalendar
              // schedules={schedules}
              minDate={dayjs().startOf('day')}
            />
          </Box>
          <Grid item xs={12} md={8}>
            <SelectTimeSlots
              availableSlots={availableClientSlots}
              selectedSlot={currentSelectedSlot}
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
