import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Box, Button, Divider, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

/**
 * LoginSection component
 *
 * This component displays the login/logout section based on the user's authentication state.
 */
const LoginSection: React.FC = () => {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('provider');
  const [password, setPassword] = useState('provider');

  /**
   * Handles the form submission for login.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <Box display="flex" alignItems="center">
      {user ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            gap: '10px',
          }}
        >
          <Divider orientation="vertical" flexItem />
          {location.pathname !== '/login' && (
            <Typography color="text.primary" variant="subtitle1" noWrap>
              {user.name}
            </Typography>
          )}
          <Button
            color="inherit"
            variant="outlined"
            size="medium"
            onClick={logout}
            sx={{ marginLeft: 2 }}
          >
            Logout
          </Button>
        </Box>
      ) : (
        location.pathname !== '/login' && (
          <Button color="inherit" component={Link} to={'/login'}>
            Sign in
          </Button>
        )
      )}
    </Box>
  );
};

export default LoginSection;
