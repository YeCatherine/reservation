import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'provider' | 'client'>(
    'provider'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', {
        name: username,
        password,
      });

      if (response.status === 200) {
        await login(username, password); // Assuming login function handles user state
        if (accountType === 'provider') {
          navigate('/provider');
        } else {
          navigate('/client');
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid username or password');
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        style={{ padding: '3rem', marginTop: '2rem', marginBottom: '3rem' }}
      >
        <Typography variant="h5" align="center">
          Choose Account Type
        </Typography>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          style={{ margin: '1rem 0' }}
        >
          <Grid item xs={5} style={{ padding: '8px' }}>
            <Paper
              elevation={accountType === 'provider' ? 4 : 1}
              style={{
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer',
                border:
                  accountType === 'provider' ? '2px solid #80B1A7' : 'none',
              }}
              onClick={() => setAccountType('provider')}
            >
              <Typography variant="subtitle1">Provider</Typography>
            </Paper>
          </Grid>
          <Grid item xs={5} style={{ padding: '8px' }}>
            <Paper
              elevation={accountType === 'client' ? 4 : 1}
              style={{
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer',
                border: accountType === 'client' ? '2px solid #80B1A7' : 'none',
              }}
              onClick={() => setAccountType('client')}
            >
              <Typography variant="subtitle1">Client</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Typography variant="subtitle1" align="center">
          Hello {accountType}!
        </Typography>
        <Typography
          variant="body2"
          align="center"
          style={{ marginBottom: '1rem' }}
        >
          Please fill out the form below to get started
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '1rem' }}
          >
            Login
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                style={{ marginTop: '1rem' }}
                onClick={async () => {
                  await login('provider1', 'provider1');
                  navigate('/provider');
                }}
              >
                Authorize as Demo Provider
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                style={{ marginTop: '1rem' }}
                onClick={async () => {
                  await login('client1', 'client1');
                  navigate('/provider');
                }}
              >
                Authorize as Demo client
              </Button>
            </>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
