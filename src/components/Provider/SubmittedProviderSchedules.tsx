import React, { useCallback } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Button, Divider, List, ListItem, ListItemText } from '@mui/material';
import dayjs from 'dayjs';
import { useProvider } from '../Client/context/ProviderContext';
import { deleteProviderAvailability } from '../../utils/providersService';
import { Reservation } from '../../types';
import { DATE_TIME_FORMAT_LONG, TIME_FORMAT_AM_PM } from '../../consts';
import { prepareTimeSlotPeriod } from '../../utils/timeService';

export const prepareSlotPeriodText = (slot: Reservation): string => {
  const { preparedTimeSlotStart, preparedTimeSlotEnd } =
    prepareTimeSlotPeriod(slot);
  if (!preparedTimeSlotStart || !preparedTimeSlotEnd)
    return 'no date available';

  const startTime = preparedTimeSlotStart.format(TIME_FORMAT_AM_PM);
  const endTime = preparedTimeSlotEnd.format(TIME_FORMAT_AM_PM);
  return `${startTime} - ${endTime} | ${slot.slot[0].timezone}`;
};

const formatPrimaryText = (slot: Reservation): string => {
  const date = typeof slot.date === 'string' ? dayjs(slot.date) : slot.date;
  return date.format(DATE_TIME_FORMAT_LONG);
};

const styles = {
  cardContent: {
    pr: 1,
    pl: 1,
    pt: 0,
    m: 0,
    '&:last-child': { paddingBottom: 0 },
  },
  listItem: {
    borderBottom: '1px solid #ccc',
    padding: 1,
    backgroundColor: 'primary',
  },
};

/**
 * Display all submitted schedules.
 * @param setSchedules
 * @constructor
 */
const SubmittedSchedules = React.memo(() => {
  const { availableSlots, setAvailableSlots, currentProvider } = useProvider();
  console.log('availableSlots: ', availableSlots);

  if (!availableSlots || Object.keys(availableSlots).length === 0) {
    return null;
  }

  /**
   * Handle delete availability.
   */
  const handleDelete = useCallback(
    async (date: string | Date) => {
      try {
        await deleteProviderAvailability(currentProvider, date);

        setAvailableSlots((prev: Reservation[]) =>
          prev.filter((slot) => slot.date !== date)
        );
      } catch (error) {
        console.error('Error occurred while deleting availability:', error);
      }
    },
    [currentProvider, setAvailableSlots]
  );

  return (
    <Card>
      <CardHeader title="Working Schedule" subheader="TimeZone (PST)" />
      <CardContent sx={styles.cardContent}>
        <Divider />
        <List>
          {availableSlots.map((slot: Reservation, index) => (
            <ListItem key={index} sx={styles.listItem}>
              <ListItemText
                primary={formatPrimaryText(slot)}
                secondary={prepareSlotPeriodText(slot)}
              />
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => handleDelete(slot.date)}
              >
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
});

export default SubmittedSchedules;
