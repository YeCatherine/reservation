import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Button, Divider, List, ListItem, ListItemText } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useProvider } from '../Client/context/ProviderContext.tsx';
import { deleteProviderAvailability } from '../../utils/providersService.ts';

import { Reservation, Slot } from '../../types';
import {
  DATE_TIME_FORMAT,
  DATE_TIME_FORMAT_LONG,
  TIME_FORMAT,
} from '../../consts';

type SlotProps = {
  start: string | Dayjs;
  date: string | Dayjs;
  end: string | Dayjs;
};

export const prepareSlotPeriodText = (reservation: SlotProps): string => {
  const start =
    typeof reservation.slot[0].start === 'string'
      ? reservation.slot[0].start
      : dayjs(reservation.slot[0].start).format('HH:mm');
  const end =
    typeof reservation.slot[0].end === 'string' ? reservation.slot[0].end : dayjs(reservation.slot[0].end).format('HH:mm');


  if ( reservation.date !== null) {
    const startTime = dayjs(`${reservation.date} ${start}`, DATE_TIME_FORMAT).format(
      'h A'
    );
    const endTime = dayjs(`${reservation.date} ${end}`, DATE_TIME_FORMAT).format(
      'h A'
    );

    return `${startTime} - ${endTime}`;
  } else {
    return 'no date available';
  }
};

const formatPrimaryText = (slot: SlotProps): string => {
  const date =
    typeof slot.date === 'string' ? dayjs(slot.date) : dayjs(slot.date);
  return `${date.format(DATE_TIME_FORMAT_LONG)}`;
};

/**
 * Display all submitted schedules.
 * @param setSchedules
 * @constructor
 */
export function SubmittedSchedules() {
  const { availableSlots, setAvailableSlots, currentProvider } = useProvider();

  if (!availableSlots || Object.keys(availableSlots).length === 0) {
    return null;
  }

  const handleDelete = async (date: string | Date) => {
    try {
      await deleteProviderAvailability(currentProvider, date);
      setAvailableSlots((prev: Slot[]) =>
        prev.filter((slot) => slot.date !== date)
      );
    } catch (error) {
      console.error('Error occurred while deleting availability:', error);
    }
  };

  console.log('availableSlots', {availableSlots});

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
