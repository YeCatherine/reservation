import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './Auth/context/AuthContext.tsx';
import ErrorBoundary from './ErrorHandler.tsx';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

const ContextProviders = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

export default function AppProviders({ children }) {
  // Gather all providers in one place
  return (
    <ErrorBoundary>
      <Router>
        <ContextProviders>{children}</ContextProviders>
      </Router>
    </ErrorBoundary>
  );
}
