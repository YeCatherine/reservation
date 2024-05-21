import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Button, Divider, List, ListItem, ListItemText } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { Schedule, SubmittedSchedule } from '../types';

/**
 * Display all submitted schedules.
 * @param schedules
 * @param setSchedules
 * @constructor
 */
export function SubmittedSchedules({ schedules, setSchedules }) {
  if (schedules.length === 0) {
    return null;
  }

  const prepareText = (schedule: Schedule | SubmittedSchedule): string => {
    if ('slots' in schedule) {
      return schedule.slots
        .map((slot) => `${slot.start} - ${slot.end}`)
        .join(', ');
    } else {
      return `Reserved time: ${schedule.slot.start} - ${schedule.slot.end}`;
    }
  };

  return (
    <Card>
      <CardHeader title="All Submitted Schedules" subheader="TimeZone (UTC)" />
      <CardContent
        sx={{ pr: 1, pl: 1, pt: 0, m: 0, '&:last-child': { paddingBottom: 0 } }}
      >
        <Divider />
        <List>
          {schedules.map((schedule, index) => (
            <ListItem
              key={index}
              sx={{
                borderBottom: '1px solid #ccc',
                padding: 1,
                backgroundColor: 'primary',
              }}
            >
              <ListItemText
                primary={dayjs(schedule.date).format('MMMM D, YYYY')}
                secondary={prepareText(schedule)}
              />
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() =>
                  setSchedules((prev) => prev.filter((_, i) => i !== index))
                }
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
