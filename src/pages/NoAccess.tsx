import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/Auth/context/AuthContext.tsx';
import { Container } from '@mui/material';

const NoAccess: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      <h2>Access Denied</h2>
      <p>You do not have access to this page.</p>
      <p>
        Please <Link to={user ? '/client' : '/'}>go back</Link> to the home
        page.
      </p>
    </Container>
  );
};
export default NoAccess;
