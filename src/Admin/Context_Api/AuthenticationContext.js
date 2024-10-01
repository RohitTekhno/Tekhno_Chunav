import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem('politicianToken');
    if (storedUser) {
      setUserId(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (userData) => {
    setUserId(userData);
    setIsAuthenticated(true);
    await AsyncStorage.setItem('politicianToken', JSON.stringify(userData));
  };

  const logout = async () => {
    setUserId(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('politicianToken');
  };

  return (
    <AuthenticationContext.Provider value={{ isAuthenticated, userId, login, logout, setUserId, setIsAuthenticated }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
