import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { Reservation, Schedule } from '../types/index.ts';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DATE_TIME_FORMAT, DEFAULT_TIMER } from '../consts';

import { Provider, Slot } from '../types';
import { SelectTimeSlots } from '../components/Client/SelectTimeSlots.tsx';
import { useAuth } from '../components/Auth/context/AuthContext.tsx';
import {
  ALL_PROVIDERS,
  useProvider,
} from '../components/Client/context/ProviderContext.tsx';
import { SelectProvidersSection } from '../components/Client/SelectProvidersSection.tsx';
import { ReservationSubmit } from '../components/Reservations/ReservationSubmit.tsx';
import { generateTimeSlots } from '../utils/GenerateTimeSlots.tsx';

import PageLayout from '../components/ui/PageLayout.tsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { SelectProvider } from '../components/Client/SelectProvider.tsx';
import { CommonCalendar } from '../components/Calendar/CommonCalendar.tsx';
import { useDay } from '../components/Calendar/context/DayContext.tsx';
import DebugPanel from '../components/DebugPanel.tsx';
import { createReservation } from '../utils/reservationService.tsx';
import { fetchProviders } from '../utils/providersAvailability.ts';
import Reservations from '../components/Reservations/Reservation.tsx';
import { useReservations } from '../components/Reservations/context/ReservationContext.tsx';

dayjs.extend(utc);
dayjs.extend(timezone);

const guessTZ = dayjs.tz.guess();

const ClientPage: React.FC = () => {
  const { user } = useAuth();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [reservation, setReservation] = useState<Reservation[]>(null);
  const {
    reservations,
    // fetchUserReservations,
    createNewReservation,
    updateExistingReservation,
    removeReservation,
  } = useReservations();
  const { currentProvider, setCurrentProvider, currentDaySlots } = useProvider<
    number | 'provider1'
  >(ALL_PROVIDERS);

  const { selectedDate, selectedTimezone, setSelectedTimezone } = useDay();

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [timer, setTimer] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [availableProvidersForSlot, setAvailableProvidersForSlot] = useState<
    Provider[]
  >([]);

  const [availableClientSlots, setAvailableClientSlots] = useState<Slot[]>([]);

  useEffect(() => {
    // Set current provider as current user id in case if he is provider..
    if (!currentDaySlots) {
      return;
    }

    const availableClientSlotsResponse = generateTimeSlots(
      selectedTimezone,
      currentDaySlots.start,
      currentDaySlots.end
    );
    console.log({
      selectedTimezone,
      currentDaySlots,
      availableClientSlotsResponse,
    });
    setAvailableClientSlots(availableClientSlotsResponse);
  }, [selectedDate, currentProvider, selectedTimezone, currentDaySlots]);

  useEffect(() => {
    fetchProviders(setProviders, setSchedules);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (selectedSlot) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [selectedSlot]);

  const handleSlotClick = (slot: Slot) => {
    if (!slot.disabled && !slot.reserved) {
      setSelectedSlot(slot);
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
            setSelectedSlot(null);
            // setOpenConfirmDialog(false);
            //closeModal('confirmationDialog');
            return null;
          }
        });
      }, 1000);

      // debugger;
      const newSubmittedSchedule: Reservation = {
        date: selectedDate.format(DATE_TIME_FORMAT),
        slot: slot,
        timer: timer,
        status: 'pending',
        providerId: currentProvider,
      };

      createReservation(newSubmittedSchedule).then((reservation) => {
        // setSubmittedSchedules([newSubmittedSchedule]); // Replace the previous reservation
        // @todo new logic
        createNewReservation(reservation);
        setReservation(reservation);
      });

      setIntervalId(newIntervalId);

      if (currentProvider === ALL_PROVIDERS) {
        // debugger;
        const providersForSlot = providers.filter((provider) => {
          const schedule = provider.schedules.find(
            (s) => s.date === selectedDate?.format(DATE_TIME_FORMAT)
          );
          return schedule?.slots.some(
            (s) => s.start === slot.start && s.end === slot.end
          );
        });
        setAvailableProvidersForSlot(providersForSlot);
        setCurrentProvider(null);
      } else {
        setAvailableProvidersForSlot([]);
      }
    }
  };

  const title = 'Scheduling App';

  // Disable access for non-authorized and Provider.
  // if (!user) return <NoAccess />;
  // if (user.role !== Role.Client) return <NoAccess />;

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
          <Grid
            flex={1}
            direction="column"
            sx={{ gap: '10px', display: 'flex' }}
          >
            <SelectProvider providers={providers} />
            <CommonCalendar
              selectedTimezone={selectedTimezone}
              setSelectedTimezone={setSelectedTimezone}
              schedules={schedules}
              minDate={dayjs().startOf('day')}
            ></CommonCalendar>
          </Grid>
          <Grid item xs={12} md={8}>
            <SelectTimeSlots
              date={selectedDate}
              availableSlots={availableClientSlots}
              selectedSlot={selectedSlot}
              handleSlotClick={handleSlotClick}
            />
            <DebugPanel
              data={{
                reservations,
                createNewReservation,
                updateExistingReservation,
                removeReservation,
              }}
              title={'availableSlots'}
              expanded={false}
            />
            <SelectProvidersSection
              selectedSlot={selectedSlot}
              availableProvidersForSlot={availableProvidersForSlot}
            />
            <ReservationSubmit
              selectedSlot={selectedSlot}
              availableProvidersForSlot={availableProvidersForSlot}
              timer={timer}
              reservation={reservation}
            />
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
