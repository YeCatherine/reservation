import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Paper, TextField } from '@mui/material';
import { TimeZoneSelector } from '../TimeZones/TimeZoneSelector';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import BuzyDay from '../Calendar/BuzyDay';
import CalendarMobile from './CalendarMobile';
import { useDay } from './context/DayContext';

/**
 * CommonCalendar component
 *
 * A calendar component for selecting dates and displaying schedules.
 *
 * @param {Array} props.schedules - Array of schedule objects
 * @param {React.ReactNode} props.children - Child components
 * @param {dayjs.Dayjs} [minDate] - Minimum selectable date
 */
export function CommonCalendar({
  schedules,
  minDate = dayjs().add(1, 'day'),
}: {
  schedules: Schedule[];
  minDate?: dayjs.Dayjs;
}): JSX.Element {
  const { selectedDate, setSelectedDate } = useDay();
  const [expanded, setExpanded] = useState(true);

  /**
   * Toggle the expanded state of the calendar.
   */
  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  // Collapse calendar on mobile.
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth <= 600) {
  //       setExpanded(false);
  //     } else {
  //       setExpanded(true);
  //     }
  //   };
  //   window.addEventListener('resize', handleResize);
  //   handleResize();
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  return (
    <Card>
      <CardHeader title="Select Date and Time" action={<TimeZoneSelector />} />
      <CardContent
        sx={{ pr: 1, pl: 1, pt: 0, m: 0, '&:last-child': { paddingBottom: 1 } }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Paper elevation={3} sx={{ padding: 1, overflow: 'hidden' }}>
            <CalendarMobile
              handleToggleExpand={handleToggleExpand}
              expanded={expanded}
              minDate={minDate}
            />
            {expanded && (
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                openTo="day"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                minDate={minDate}
                slots={{
                  textField: (params) => <TextField {...params} />,
                  day: BuzyDay,
                }}
                slotProps={{
                  day: {
                    schedules,
                  } as any,
                }}
              />
            )}
          </Paper>
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
}
