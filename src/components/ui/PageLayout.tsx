import React from 'react';
import { Box, Paper } from '@mui/material';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <Box
      sx={{
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: {
          xs: 1, // 3 for mobile
          md: 14, // 14 for desktop
        },
        paddingRight: {
          xs: 1, // 3 for mobile
          md: 14, // 14 for desktop
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
        {/*<Typography variant="h4" align="center" gutterBottom>*/}
        {/*  {title}*/}
        {/*</Typography>*/}
        {children}
      </Paper>
    </Box>
  );
};

export default PageLayout;
