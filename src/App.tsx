import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProviderPage from './pages/ProviderPage';
import ClientPage from './pages/ClientPage';
import Login from './components/Auth/Login.tsx';
import LayoutWrapper from './components/ui/LayoutWrapper.tsx';
import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Providers from './components/ui/AppProviders.tsx';

const App: React.FC = () => {
  return (
    <Providers>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/provider" element={<ProviderPage />} />
          <Route path="/client" element={<ClientPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <ToastContainer autoClose={500} />
      </LayoutWrapper>
    </Providers>
  );
};

export default App;
