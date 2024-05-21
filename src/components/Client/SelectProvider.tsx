import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ALL_PROVIDERS, useProvider } from './context/ProviderContext';

/**
 * SelectProvider component
 *
 * A component for selecting the current provider from a list.
 *
 * @param {Array} providers - Array of provider objects
 * @returns {JSX.Element} The rendered component
 */
export function SelectProvider({ providers }) {
  const { currentProvider, setCurrentProvider } = useProvider<
    number | 'provider1'
  >(ALL_PROVIDERS);

  return (
    <Card>
      <CardContent
        sx={{ pr: 1, pl: 1, pt: 0, m: 0, '&:last-child': { paddingBottom: 0 } }}
      >
        <FormControl fullWidth margin="normal">
          <InputLabel id="provider-select-label">Select Provider</InputLabel>
          <Select
            labelId="provider-select-label"
            value={currentProvider}
            onChange={(e) =>
              setCurrentProvider(e.target.value as number | 'provider1')
            }
            label="Select Provider"
            sx={{ p: 0, m: 0 }}
          >
            <MenuItem value="any">Any Provider</MenuItem>
            {providers.map((provider) => (
              <MenuItem key={provider.id} value={provider.id}>
                {provider.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}
