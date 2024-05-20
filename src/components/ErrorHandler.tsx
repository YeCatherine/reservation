import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Container, Typography } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const isDev = process.env.NODE_ENV === 'development';

    if (hasError) {
      if (isDev) {
        return (
          <Container>
            <Typography variant="h4" gutterBottom>
              Something went wrong.
            </Typography>
            <Typography variant="h6" gutterBottom>
              {error?.toString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {errorInfo?.componentStack}
            </Typography>
            <Button
              onClick={() => window.location.reload()}
              variant="contained"
              color="primary"
            >
              Reload
            </Button>
          </Container>
        );
      } else {
        return (
          <Container>
            <Typography variant="h4" gutterBottom>
              Something went wrong. Please contact support.
            </Typography>
            <Button
              onClick={() => window.location.reload()}
              variant="contained"
              color="primary"
            >
              Reload
            </Button>
          </Container>
        );
      }
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
