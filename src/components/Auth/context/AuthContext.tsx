import React, { createContext, ReactNode, useContext, useState } from 'react';
import axios from 'axios';
import { User } from '../../../types';

interface AuthContextProps {
  user?: User | null;
  userType: string;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    userType: string
  ) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // @todo remove that hardcoded user.
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState('');

  const login = async (username: string, password: string) => {
    const response = await axios.post('/api/auth/login', {
      name: username,
      password,
    });

    setUser(response.data.user);
    setUserType(response.data.userType);
  };

  const register = async (
    username: string,
    password: string,
    userType: string
  ) => {
    const response = await axios.post('/api/register', {
      username,
      password,
      userType,
    });
    setUser(response.data.user);
    setUserType(response.data.userType);
  };

  const logout = () => {
    setUser(null);
    setUserType('');
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
