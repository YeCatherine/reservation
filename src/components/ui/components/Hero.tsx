import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundColor: theme.palette.mode === 'light' ? '#5C998C' : '#120526',
        backgroundSize: '100% 70%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 12, sm: 16 },
          pb: { xs: 2, sm: 4 },
        }}
      >
        <Stack
          spacing={0.5}
          useFlexGap
          sx={{ width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(2rem, 7vw, 3rem)',
              color: (theme) =>
                theme.palette.mode === 'light' ? 'grey.50' : 'grey.300',
            }}
          >
            Scheduling App
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
