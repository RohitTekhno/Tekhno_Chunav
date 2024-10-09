import { Image, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator, Vibration } from 'react-native';
import React, { useContext, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BoothUser_Context } from '../Context_Api/BoothUser_Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthenticationContext } from '../Context_Api/AuthenticationContext';

const LogInScreen = () => {
    const navigation = useNavigation();
    const { setBoothUserId } = useContext(BoothUser_Context);
    const { login } = useContext(AuthenticationContext);
    const [username, setUsername] = useState("politician");
    const [password, setPassword] = useState("politician123");
    const [isTextSecure, setTextSecure] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');

    const toggleSecureText = () => {
        setTextSecure(!isTextSecure);
    };


    const validate = () => {
        let isValid = true;
        if (!username) {
            setNameError('username is required.');
            isValid = false;
        } else if (username.length < 2) {
            setNameError('username must be at least 2 characters.');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!password) {
            setPasswordError('Password is required.');
            isValid = false;
        } else if (password.length < 5) {
            setPasswordError('Password must be at least 5 characters long.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const LogInUser = async () => {
        if (validate()) {
            setLoading(true);
            Vibration.vibrate(100);

            try {
                const response = await axios.post(`http://192.168.200.23:8000/api/politician_login/`, {
                    "politician_name": username,
                    "politician_password": password
                });

                if (response.status === 200) {
                    const userId = response.data.user_id;
                    setBoothUserId(userId);
                    navigation.navigate('Dashboard');
                } else {
                    console.warn('Unexpected response:', response);
                }
            } catch (error) {
                if (error.response) {
                    console.warn('Error:', error.response.data);
                    console.warn('Status Code:', error.response.status);
                    alert('Login failed: ' + (error.response.data.message || 'Invalid credentials.'));
                } else if (error.request) {
                    console.warn('Network error:', error.request);
                    alert('Network error: Please check your internet connection.');
                } else {
                    console.warn('Error message:', error.message);
                    alert('An unexpected error occurred: ' + error.message);
                }
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <LinearGradient colors={['#3C4CAC', '#F04393']} locations={[0.01, 0.4]} style={styles.linearGradient}>
            <View style={styles.logoContainer}>
                <Image source={require('../Assets/tekhnoWhite.png')} style={styles.logo} />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Log In</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        value={username}
                        placeholder='Enter username here ...'
                        onChangeText={setUsername}
                        style={styles.input}
                    />
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            value={password}
                            placeholder='Enter password here ...'
                            onChangeText={setPassword}
                            secureTextEntry={isTextSecure}
                            style={styles.passwordInput}
                        />
                        <Pressable onPress={toggleSecureText} style={styles.eyeIcon}>
                            <Feather name={isTextSecure ? "eye-off" : "eye"} size={24} color="black" />
                        </Pressable>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>
                <Pressable onPress={LogInUser} style={styles.loginButton}>
                    {!isLoading ? (
                        <Text style={styles.loginButtonText}>Log in</Text>
                    ) : (
                        <ActivityIndicator color={'white'} size={'large'} />
                    )}
                </Pressable>
            </View>
        </LinearGradient>
    );
};

export default LogInScreen;

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    logoContainer: {
        flex: 0.35,
        paddingTop: "20%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        height: 220,
        width: 220
    },
    formContainer: {
        flex: 0.7,
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center'
    },
    inputContainer: {
        marginVertical: 5
    },
    label: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600'
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#BCC1CA',
        paddingVertical: 10,
        borderRadius: 8,
        marginVertical: 5,
        paddingHorizontal: 20,
    },
    passwordContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginVertical: 5,
        width: '100%',
        borderWidth: 1,
        borderColor: '#BCC1CA',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        justifyContent: 'space-between'
    },
    passwordInput: {
        flex: 1,
        padding: 10
    },
    eyeIcon: {
        paddingRight: 10
    },
    loginButton: {
        backgroundColor: '#E54394',
        width: '100%',
        height: 50,
        borderRadius: 8,
        marginVertical: 10,
        paddingVertical: 10
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        color: 'white'
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
