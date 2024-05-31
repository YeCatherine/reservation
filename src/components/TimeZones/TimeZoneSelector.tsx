import { FormControl, MenuItem, Select } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useDay } from '../Calendar/context/DayContext';

dayjs.extend(utc);
dayjs.extend(timezone);

const guessTZ = dayjs.tz.guess();

const TimezoneOptions = [
  { label: 'PST', value: 'America/Los_Angeles' },
  { label: 'CST', value: 'America/Chicago' },
  { label: 'EST', value: 'America/New_York' },
  { label: 'UTC', value: 'UTC' },
];

/**
 * TimeZoneSelector component
 *
 * A component for selecting the time zone.
 *
 * @returns {JSX.Element} The rendered component
 */
export default function TimeZoneSelector(): JSX.Element {
  const { selectedTimezone, setSelectedTimezone } = useDay();
  return (
    <FormControl
      fullWidth
      margin="normal"
      sx={{
        width: '120px',
      }}
    >
      <Select
        labelId="timezone-select-label"
        value={selectedTimezone}
        defaultValue={guessTZ}
        onChange={(e) => {
          setSelectedTimezone(e.target.value);
        }}
        sx={{
          fontSize: '14px',
          color: 'text.primary',
          padding: '0px 8px',
          '& .MuiSelect-select': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 0px',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'text.primary',
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: 'grey.300',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'grey.300',
            },
            '&:hover fieldset': {
              borderColor: 'grey.300',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'grey.300',
            },
          },
          '& .MuiOutlinedInput-input': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.900' : 'inherit',
            textAlign: 'center',
            padding: '4px 8px',
          },
        }}
      >
        {TimezoneOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              fontSize: '14px',
              color: 'text.primary',
              backgroundColor: 'transparent',
              borderBottom: 'none',
              padding: '4px 8px',
              margin: '0',
              justifyContent: 'center',
              minHeight: '30px',
              '&.Mui-selected': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300',
              },
              '&:hover': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
