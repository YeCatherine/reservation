import * as React from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppAppBar from './AppAppBar.tsx';
import Hero from './components/Hero.tsx';
import FAQ from './components/FAQ.tsx';
import Footer from './components/Footer.tsx';
import getLPTheme from './components/getLPTheme.tsx';

export default function LayoutWrapper({ children }) {
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Hero />
      <Box sx={{ bgcolor: 'background.default' }}>
        <Divider />
        {children}
        <Divider />
        <FAQ />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
