import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useDay } from './context/DayContext';

dayjs.extend(isSameOrBefore);

type TCalendarMobileProps = {
  /**
   * Determines if the component is expanded
   */
  expanded: boolean;
  /**
   * Function to toggle the component's expanded state
   */
  handleToggleExpand: () => void;
  /**
   * The minimum date allowed to be selected
   */
  minDate: dayjs.Dayjs | null;
};

/**
 * DateSelector component
 *
 * A component to select and navigate between dates.
 *
 * @param {boolean} expanded - Determines if the component is expanded
 * @param {() => void} handleToggleExpand - Function to toggle the component's expanded state
 * @param {dayjs.Dayjs | null} minDate - The minimum date allowed to be selected
 */
const CalendarMobile: React.FC<TCalendarMobileProps> = ({
  expanded,
  handleToggleExpand,
  minDate,
}) => {
  const { selectedDate, setSelectedDate } = useDay();
  const [allowPreviousDay, setAllowPreviousDay] = useState(true);

  useEffect(() => {
    // Show previous day only if selected date is after today and minDate is set. That means no restrictions.
    if (selectedDate && minDate) {
      setAllowPreviousDay(
        selectedDate.isAfter(dayjs().add(1, 'day').startOf('day'))
      );
    }
  }, [selectedDate, minDate]);

  const handlePreviousDay = () => {
    setSelectedDate(selectedDate.subtract(1, 'day'));
  };

  const handleNextDay = () => {
    setSelectedDate(selectedDate.add(1, 'day'));
  };
  if (!selectedDate) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center" justifyContent="center">
        {allowPreviousDay && (
          <IconButton onClick={handlePreviousDay}>
            <ArrowBack />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ mx: 2 }}>
          {selectedDate.format('MMMM DD, YYYY')}
        </Typography>
        <IconButton onClick={handleNextDay}>
          <ArrowForward />
        </IconButton>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" m={0}>
        <IconButton onClick={handleToggleExpand}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default CalendarMobile;
