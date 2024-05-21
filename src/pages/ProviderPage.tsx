import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import axios from 'axios';
import { Schedule, Slot } from '../types';
import { DATE_TIME_FORMAT, Role } from '../consts';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { SubmittedSchedules } from './SubmittedProviderSchedules.tsx';
import { useAuth } from '../components/Auth/context/AuthContext.tsx';
import NoAccess from './NoAccess.tsx';
import {
  ALL_PROVIDERS,
  useProvider,
} from '../components/Client/context/ProviderContext.tsx';
import PageLayout from '../components/ui/PageLayout.tsx';
import { CommonCalendar } from '../components/Calendar/CommonCalendar.tsx';
import SelectTimeSlots from '../components/Provider/SelectTimeSlots.tsx';
import { useDay } from '../components/Calendar/context/DayContext.tsx';

dayjs.extend(utc);
dayjs.extend(timezone);

const guessTZ = dayjs.tz.guess();

/**
 * Fetch schedules from the API.
 * @param {function} setSchedules - Function to set schedules state.
 */
const fetchSchedules = async (setSchedules) => {
  try {
    const response = await axios.get('/api/schedules');
    setSchedules(response.data);
  } catch (error) {
    console.error('Error fetching schedules:', error);
  }
};

/**
 * Save schedules to the API.
 * @param {Array} schedules - Array of schedules to save.
 */
const saveSchedules = async (schedules) => {
  try {
    await axios.post('/api/schedules', schedules);
  } catch (error) {
    console.error('Error saving schedule:', error);
  }
};

/**
 * ProviderPage component for displaying and managing provider schedules.
 * @returns {JSX.Element}
 */
const ProviderPage: React.FC = () => {
  const { user } = useAuth();
  const {
    currentProvider,
    setCurrentProvider,
    availableSlots,
    currentDaySlots,
  } = useProvider<number | 'provider1'>(ALL_PROVIDERS);

  const {
    selectedDate,
    setSelectedDate,
    selectedTimezone,
    setSelectedTimezone,
  } = useDay();

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    fetchSchedules(setSchedules);
  }, []);

  const [selectedDateSlots, setSelectedDateSlots] = useState<Slot[]>([]);

  useEffect(() => {
    if (selectedDate) {
      const schedule = schedules.find(
        (s) => s.date === selectedDate.format(DATE_TIME_FORMAT)
      );
      setSelectedDateSlots(schedule ? schedule.slots : []);
    }
  }, [selectedDate, schedules]);

  if (!user) return <NoAccess />;
  if (user.role !== Role.Provider) return <NoAccess />;

  const title = 'Provider Schedule';

  /**
   * Handle click event on a time slot.
   * @param {Slot} slot - The time slot that was clicked.
   */
  const handleSlotClick = (slot: Slot) => {
    if (selectedDate && selectedDate.isAfter(dayjs().startOf('day'))) {
      const scheduleIndex = schedules.findIndex(
        (s) => s.date === selectedDate.format(DATE_TIME_FORMAT)
      );
      let newSchedules = [];
      if (scheduleIndex >= 0) {
        const slotIndex = schedules[scheduleIndex].slots.findIndex(
          (s) => s.start === slot.start && s.end === slot.end
        );
        if (slotIndex >= 0) {
          schedules[scheduleIndex].slots.splice(slotIndex, 1);
        } else {
          schedules[scheduleIndex].slots.push(slot);
        }
        setSchedules([...schedules]);
        newSchedules = [...schedules];
      } else {
        const newSchedule: Schedule = {
          date: selectedDate.format(DATE_TIME_FORMAT),
          slots: [slot],
        };
        setSchedules([...schedules, newSchedule]);
        newSchedules = [...schedules, newSchedule];
      }

      saveSchedules(newSchedules);

      setSelectedDateSlots((prevSlots) => {
        const existingSlotIndex = prevSlots.findIndex(
          (s) => s.start === slot.start && s.end === slot.end
        );
        if (existingSlotIndex >= 0) {
          return prevSlots.filter((_, index) => index !== existingSlotIndex);
        } else {
          return [...prevSlots, slot];
        }
      });
    }
  };

  return (
    <PageLayout title={title}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <CommonCalendar schedules={schedules} minDate={null} />
          </Grid>
          <Grid item xs={12} md={8}>
            <SelectTimeSlots
              date={selectedDate}
              selectedDateSlots={selectedDateSlots}
              handleSlotClick={handleSlotClick}
            />
          </Grid>
          <Grid item xs={12}>
            <Box mt={1} p={1}>
              <SubmittedSchedules
                schedules={schedules}
                setSchedules={setSchedules}
              />
            </Box>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </PageLayout>
  );
};

export default ProviderPage;
