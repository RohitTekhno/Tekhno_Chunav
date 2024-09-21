import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

export const BoothUserContext = createContext();

export const BoothUserProvider = ({ children }) => {
    const [userName, setUserName] = useState(null);
    const [buserName, setBuserName] = useState(null);
    const [boothId, setBooothId] = useState(null);
    const [buserId, setBuserId] = useState(null)
    const [isBuserAuthenticated, setBuserAuthenticated] = useState(false);

    const loadUser = async () => {
        const storedUser = await AsyncStorage.getItem('BUserToken');
        if (storedUser) {
            setBuserId(JSON.parse(storedUser));
            setBuserAuthenticated(true);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const loginBuser = async (userData) => {
        setBuserId(userData);
        setBuserAuthenticated(true);
        await AsyncStorage.setItem('BUserToken', JSON.stringify(userData));
    };

    const logoutBuser = async () => {
        setBuserId(null);
        setBuserAuthenticated(false);
        await AsyncStorage.removeItem('BUserToken');
    };

    return (
        <BoothUserContext.Provider value={{ userName, setUserName, boothId, setBooothId, buserId, setBuserId, buserName, setBuserName, logoutBuser, isBuserAuthenticated, loginBuser }}>
            {children}
        </BoothUserContext.Provider>
    );
};