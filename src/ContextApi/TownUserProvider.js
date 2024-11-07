import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const TownUserContext = createContext();

export const TownUserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [tuserName, settuserName] = useState('');
  const [boothId, setBoothId] = useState('');
  const [userId, setUserId] = useState(null)
  const [isTuserAuthenticated, setTuserAuthenticated] = useState(false);
  const [token, setToken] = useState(null)

  const loadUser = async () => {
    try {
      await AsyncStorage.removeItem('TUserToken');

      const storedUserToken = await AsyncStorage.getItem('TUserToken');

      if (storedUserToken) {
        setToken(storedUserToken);
        try {
          const decoded = jwtDecode(storedUserToken);
          const expirationDate = new Date(decoded.exp * 1000);
          if (expirationDate > new Date()) {
            setUserId(decoded.town_user_id);
            setTuserAuthenticated(true);
          } else {
            logoutTuser();
            setError('Token expired. Please log in again.');
          }
        } catch (error) {
          Alert.alert('Error decoding token on load:', error);
          setError('Failed to decode token. Please log in again.');
        }
      }
    } catch (error) {
      Alert.alert('Error loading user data from AsyncStorage:', error);
      setError('Failed to load user data. Please try again later.');
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (userData) => {
    try {
      const decoded = jwtDecode(userData);
      const expirationDate = new Date(decoded.exp * 1000);

      setToken(userData);
      setUserId(decoded.town_user_id);
      setTuserAuthenticated(true);
      await AsyncStorage.setItem('TUserToken', userData);
    } catch (error) {
      Alert.alert('Error during login:', error);
      setError('Failed to log in. Invalid token or network error.');
    }
  };

  const logoutTuser = async () => {
    try {
      setUserId(null);
      setTuserAuthenticated(false);
      setToken(null);
      await AsyncStorage.removeItem('TUserToken');
    } catch (error) {
      Alert.alert('Error during logout:', error);
      setError('Failed to log out. Please try again.');
    }
  };
  return (
    <TownUserContext.Provider value={{ userName, setUserName, boothId, setBoothId, userId, setUserId, tuserName, settuserName, login, logoutTuser, isTuserAuthenticated }}>
      {children}
    </TownUserContext.Provider>
  );
};