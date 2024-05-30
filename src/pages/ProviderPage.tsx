import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import axios from 'axios';
import { Reservation, Slot } from '../types';
import { DATE_FORMAT, Role } from '../consts';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { SubmittedSchedules } from '../components/Provider/SubmittedProviderSchedules.tsx';
import { useAuth } from '../components/Auth/context/AuthContext.tsx';
import NoAccess from './NoAccess.tsx';
import PageLayout from '../components/ui/PageLayout.tsx';
import { CommonCalendar } from '../components/Calendar/CommonCalendar.tsx';
import { useDay } from '../components/Calendar/context/DayContext.tsx';
import DateTimeRangePicker from '../components/Calendar/DateTimeRangePicker.tsx';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Fetch schedules from the API.
 * @param {function} setSchedules - Function to set schedules state.
 */
const fetchSchedules = async () => {
  try {
    const response = await axios.get('/api/schedules');
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
  }
};

const ProviderPage: React.FC = () => {
  const { user } = useAuth();

  const { selectedDate } = useDay();

  const [schedules, setSchedules] = useState<Reservation[]>([]);

  useEffect(() => {
    (async () => {
      const data = await fetchSchedules();
      setSchedules(data);
    })();
  }, []);

  const [, setSelectedDateSlots] = useState<Slot[]>([]);

  useEffect(() => {
    if (selectedDate) {
      const schedule = schedules.find(
        (s) => s.date === selectedDate.format(DATE_FORMAT)
      );

      setSelectedDateSlots(schedule && schedule.slots ? schedule.slots : []);
    }
  }, [selectedDate, schedules]);

  if (!user) return <NoAccess />;
  if (user.role !== Role.Provider) return <NoAccess />;

  const title = 'Provider Schedule';

  return (
    <PageLayout title={title}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={2}>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <CommonCalendar schedules={schedules} minDate={null} />
          </Grid>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <DateTimeRangePicker />
            <SubmittedSchedules />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </PageLayout>
  );
};

export default ProviderPage;
