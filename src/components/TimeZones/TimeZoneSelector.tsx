import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { useDay } from '../Calendar/context/DayContext.tsx';

dayjs.extend(utc);
dayjs.extend(timezone);

const guessTZ = dayjs.tz.guess();

const TimezoneOptions = [
  { label: 'PST', value: 'America/Los_Angeles' },
  { label: 'CST', value: 'America/Chicago' },
  { label: 'EST', value: 'America/New_York' },
  { label: 'UTC', value: 'UTC' },
];

export function TimeZoneSelector() {
  const {
    selectedDate,
    setSelectedDate,
    selectedTimezone,
    setSelectedTimezone,
  } = useDay();
  return (
    <FormControl
      fullWidth
      margin="normal"
      sx={{
        width: '120px', // Adjust the width to make the switcher more narrow
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
          fontSize: '14px', // Ensure readable font size
          color: 'text.primary', // Ensure high contrast text based on theme
          padding: '0px 8px', // Reduce padding inside the select
          '& .MuiSelect-select': {
            display: 'flex',
            justifyContent: 'center', // Center the text inside the select
            alignItems: 'center',
            padding: '4px 0px', // Reduce padding inside the select box
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
              theme.palette.mode === 'dark' ? 'grey.900' : 'inherit', // Ensure not transparent in dark mode
            textAlign: 'center', // Center the text inside the input
            padding: '4px 8px', // Reduce padding inside the input box
          },
        }}
      >
        {TimezoneOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              fontSize: '14px', // Ensure readable font size
              color: 'text.primary', // Ensure high contrast text based on theme
              backgroundColor: 'transparent', // Ensure background is transparent
              borderBottom: 'none', // Make options borderless
              padding: '4px 8px', // Reduce padding inside the menu items
              margin: '0', // Remove margin between options
              justifyContent: 'center', // Center the text inside the menu item
              minHeight: '30px', // Ensure a smaller height for the options
              '&.Mui-selected': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300', // Change selected background color
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
