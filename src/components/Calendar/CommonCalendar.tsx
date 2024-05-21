import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Paper, TextField } from '@mui/material';
import { TimeZoneSelector } from '../TimeZones/TimeZoneSelector';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import BuzyDay from '../Calendar/BuzyDay';
import CalendarMobile from './CalendarMobile';
import { generateTimeSlots } from '../../utils/GenerateTimeSlots';
import { DATE_TIME_FORMAT } from '../../consts';
import { useDay } from './context/DayContext';

/**
 * CommonCalendar component
 *
 * A calendar component for selecting dates and displaying schedules.
 *
 * @param {Array} props.schedules - Array of schedule objects
 * @param {React.ReactNode} props.children - Child components
 * @param {dayjs.Dayjs} [props.minDate] - Minimum selectable date
 * @returns {JSX.Element} The rendered component
 */
export function CommonCalendar({
  schedules,
  children,
  minDate = dayjs().add(1, 'day'),
}) {
  const {
    selectedDate,
    setSelectedDate,
    selectedTimezone,
    setSelectedTimezone,
  } = useDay();
  const [expanded, setExpanded] = useState(true);

  /**
   * Check if the date is fully booked.
   * @param {string} date - The date string in DATE_TIME_FORMAT
   * @returns {boolean} True if fully booked, otherwise false
   */
  const isFullyBooked = (date) => {
    const schedule = schedules.find((s) => s.date === date);
    return (
      schedule &&
      schedule.slots.length === generateTimeSlots(selectedTimezone).length
    );
  };

  /**
   * Check if the date is partially booked.
   * @param {string} date - The date string in DATE_TIME_FORMAT
   * @returns {boolean} True if partially booked, otherwise false
   */
  const isPartiallyBooked = (date) => {
    const schedule = schedules.find((s) => s.date === date);
    return (
      schedule &&
      schedule.slots.length > 0 &&
      schedule.slots.length < generateTimeSlots(selectedTimezone).length
    );
  };

  /**
   * Get the background color for a date based on booking status.
   * @param {dayjs.Dayjs} date - The date object
   * @returns {string} The background color
   */
  const getDateBackgroundColor = (date) => {
    const dateStr = date.format(DATE_TIME_FORMAT);
    if (isFullyBooked(dateStr)) {
      return '#d32f2f'; // Red for fully booked
    }
    if (isPartiallyBooked(dateStr)) {
      return '#4caf50'; // Green for partially booked
    }
    return 'transparent';
  };

  /**
   * Get the count of slots for a date.
   * @param {dayjs.Dayjs} date - The date object
   * @returns {number} The slot count
   */
  const getSlotCount = (date) => {
    const schedule = schedules.find(
      (s) => s.date === date.format(DATE_TIME_FORMAT)
    );
    return schedule ? schedule.slots.length : 0;
  };

  /**
   * Toggle the expanded state of the calendar.
   */
  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  // Collapse calendar on mobile.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card>
      <CardHeader
        title="Select Date and Time"
        action={
          <TimeZoneSelector
            selectedTimezone={selectedTimezone}
            setSelectedTimezone={setSelectedTimezone}
          />
        }
      />
      <CardContent
        sx={{ pr: 1, pl: 1, pt: 0, m: 0, '&:last-child': { paddingBottom: 1 } }}
      >
        {children}
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
