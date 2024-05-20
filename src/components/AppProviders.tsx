import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './ErrorHandler.tsx';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

export default function AppProviders({ children }) {
  // Gather all providers in one place
  return (
    <ErrorBoundary>
      <Router>{children}</Router>
    </ErrorBoundary>
  );
}
