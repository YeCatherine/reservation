import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Button, Divider, List, ListItem, ListItemText } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import {
  ALL_PROVIDERS,
  useProvider,
} from '../Client/context/ProviderContext.tsx';
import { deleteProviderAvailability } from '../../utils/providersService.ts';

import { TimeSlot } from '../../types';

/**
 * Display all submitted schedules.
 * @param setSchedules
 * @constructor
 */
export function SubmittedSchedules() {
  const { availableSlots, setAvailableSlots, currentProvider } = useProvider<
    number | 'provider1'
  >(ALL_PROVIDERS);

  if (!availableSlots || Object.keys(availableSlots).length === 0) {
    return null;
  }

  const prepareText = (slot: TimeSlot): string => {
    const start =
      typeof slot.start === 'string'
        ? slot.start
        : dayjs(slot.start).format('HH:mm');
    const end =
      typeof slot.end === 'string' ? slot.end : dayjs(slot.end).format('HH:mm');

    const startTime = dayjs(`${slot.date} ${start}`, 'YYYY-MM-DD HH:mm').format(
      'h A'
    );
    const endTime = dayjs(`${slot.date} ${end}`, 'YYYY-MM-DD HH:mm').format(
      'h A'
    );
    return `${startTime} - ${endTime}`;
  };

  const formatPrimaryText = (slot: TimeSlot): string => {
    const date =
      typeof slot.date === 'string' ? dayjs(slot.date) : dayjs(slot.date);
    return `${date.format('dddd, Do MMMM')}`;
  };

  const handleDelete = async (date: string | Date) => {
    try {
      await deleteProviderAvailability(currentProvider, date);
      setAvailableSlots((prev: TimeSlot[]) =>
        prev.filter((slot) => slot.date !== date)
      );
    } catch (error) {
      console.error('Error occurred while deleting availability:', error);
    }
  };

  return (
    <Card>
      <CardHeader
        title="My Awesome Working Schedule"
        subheader="TimeZone (PST)"
      />
      <CardContent
        sx={{ pr: 1, pl: 1, pt: 0, m: 0, '&:last-child': { paddingBottom: 0 } }}
      >
        <Divider />
        <List>
          {availableSlots.map((slot, index) => (
            <ListItem
              key={index}
              sx={{
                borderBottom: '1px solid #ccc',
                padding: 1,
                backgroundColor: 'primary',
              }}
            >
              <ListItemText
                primary={formatPrimaryText(slot)}
                secondary={prepareText(slot)}
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
}

export default SubmittedSchedules;
