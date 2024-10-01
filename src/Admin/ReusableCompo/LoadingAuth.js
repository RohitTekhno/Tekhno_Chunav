import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AuthenticationContext } from '../Context_Api/AuthenticationContext';

const LoadingAuth = () => {
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useContext(AuthenticationContext)

    const navigation = useNavigation();
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);

            if (isAuthenticated) {
                navigation.navigate('Dashboard')
            }

            if (!isAuthenticated) {
                navigation.navigate('ProfileChooser')
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);


    return (
        <View style={styles.container}>
            {loading && (
                <ActivityIndicator size="large" color="#FF9933" style={styles.loading} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading: {
        marginTop: 20,
    },
    error: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    success: {
        color: 'green',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default LoadingAuth;
