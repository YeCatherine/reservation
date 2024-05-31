import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useProvider } from './context/ProviderContext';
import { ALL_PROVIDERS } from '../../consts';
/**
 * SelectProvider component
 *
 * A component for selecting the current provider from a list.
 *
 * @returns {JSX.Element} The rendered component
 */
export function SelectProvider() {
  const { currentProvider, setCurrentProvider, providers } = useProvider();

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
            onChange={(e) => setCurrentProvider(e.target.value as string)}
            label="Select Provider"
            sx={{ p: 0, m: 0 }}
          >
            <MenuItem value={ALL_PROVIDERS}>Any Provider</MenuItem>
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

export default SelectProvider;
