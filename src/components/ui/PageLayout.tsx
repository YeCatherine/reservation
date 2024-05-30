import React from 'react';
import { Box, Paper } from '@mui/material';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: {
          xs: 1,
          md: 14,
        },
        paddingRight: {
          xs: 1,
          md: 14,
        },
      }}
    >
      <Paper
        elevation={5}
        sx={{
          padding: {
            xs: 1,
            sm: 5,
          },
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default PageLayout;
