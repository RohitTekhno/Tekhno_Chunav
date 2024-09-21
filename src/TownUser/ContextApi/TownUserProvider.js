import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

export const TownUserContext = createContext();

export const TownUserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [tuserName, settuserName] = useState('');
  const [boothId, setBooothId] = useState('');
  const [userId, setUserId] = useState(null)
  const [isTuserAuthenticated, setTuserAuthenticated] = useState(false);

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem('TUserToken');
    if (storedUser) {
      setUserId(JSON.parse(storedUser));
      setTuserAuthenticated(true);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (userData) => {
    setUserId(userData);
    setTuserAuthenticated(true);
    await AsyncStorage.setItem('TUserToken', JSON.stringify(userData));
  };

  const logoutTuser = async () => {
    setUserId(null);
    setTuserAuthenticated(false);
    await AsyncStorage.removeItem('TUserToken');
  };

  return (
    <TownUserContext.Provider value={{ userName, setUserName, boothId, setBooothId, userId, setUserId, tuserName, settuserName, login, logoutTuser, isTuserAuthenticated }}>
      {children}
    </TownUserContext.Provider>
  );
};