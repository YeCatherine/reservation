import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Button, Divider, List, ListItem, ListItemText } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useProvider } from '../Client/context/ProviderContext.tsx';
import { deleteProviderAvailability } from '../../utils/providersService.ts';

import { Slot } from '../../types';
import {
  DATE_TIME_FORMAT,
  DATE_TIME_FORMAT_LONG,
} from '../../consts';

const prepareSlotPeriodText = (slot: Slot): string => {
  const start =
      typeof slot.start === 'string'
          ? slot.start
          : dayjs(slot.start).format('HH:mm');
  const end =
      typeof slot.end === 'string'
          ? slot.end
          : dayjs(slot.end).format('HH:mm');

  if (slot.date !== null) {
    const startTime = dayjs(`${slot.date} ${start}`, DATE_TIME_FORMAT).format(
        'h A'
    );
    const endTime = dayjs(`${slot.date} ${end}`, DATE_TIME_FORMAT).format(
        'h A'
    );

    return `${startTime} - ${endTime}`;
  } else {
    return 'no date available';
  }
};

const formatPrimaryText = (slot: Slot): string => {
  const date =
      typeof slot.date === 'string' ? dayjs(slot.date) : dayjs(slot.date);
  return `${date.format(DATE_TIME_FORMAT_LONG)}`;
};

/**
 * Display all submitted schedules.
 * @constructor
 */
export function SubmittedSchedules() {
  const { availableSlots, setAvailableSlots, currentProvider } = useProvider();

  if (!availableSlots || availableSlots.length === 0) {
    return null;
  }

  const handleDelete = async (date: string | Dayjs) => {
    try {
      await deleteProviderAvailability(currentProvider, date);
      setAvailableSlots(availableSlots.filter((slot) => slot.date !== date));
    } catch (error) {
      console.error('Error occurred while deleting availability:', error);
    }
  };

  console.log('availableSlots', { availableSlots });

  return (
      <Card>
        <CardHeader title="Working Schedule" subheader="TimeZone (PST)" />
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
}

export default SubmittedSchedules;
