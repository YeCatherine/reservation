import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../Auth/context/AuthContext.tsx';
import { ProviderContextProvider } from '../Client/context/ProviderContext.tsx';
import DayProvider from '../Calendar/context/DayContext.tsx';
import { ReservationProvider } from '../Reservations/context/ReservationContext.tsx';
import ErrorBoundary from './ErrorHandler.tsx';
import 'react-toastify/dist/ReactToastify.css';
import '../../App.css';
import { ModalProvider } from './Modal/context/ModalProvider.tsx';

const ContextProviders = ({ children }) => (
  <AuthProvider>
    <DayProvider>
      <ProviderContextProvider>
        <ReservationProvider>
          <ModalProvider>{children}</ModalProvider>
        </ReservationProvider>
      </ProviderContextProvider>
    </DayProvider>
  </AuthProvider>
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
