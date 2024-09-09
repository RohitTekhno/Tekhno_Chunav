import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem('userToken');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    await AsyncStorage.setItem('userToken', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('userToken');
  };

  return (
    <AuthenticationContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
