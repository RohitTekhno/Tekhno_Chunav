import { ActivityIndicator, Alert, Dimensions, Image, Pressable, StyleSheet, Text, TextInput, Vibration, View } from 'react-native';
import React, { useContext, useState } from 'react';

import { AuthenticationContext } from '../../Admin/Context_Api/AuthenticationContext';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const { height, width } = Dimensions.get('screen');

const AdminLogin = () => {
    const { login, setUserId } = useContext(AuthenticationContext);
    const [username, setUsername] = useState("politician");
    const [password, setPassword] = useState("politician123");
    const [isTextSecure, setTextSecure] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');

    const toggleSecureText = () => {
        setTextSecure(!isTextSecure);
    };

    const validate = () => {
        let isValid = true;
        if (!username) {
            setNameError('Username is required.');
            isValid = false;
        } else if (username.length < 2) {
            setNameError('Username must be at least 2 characters.');
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

    const logInUser = async () => {
        setLoginError('');
        if (validate()) {
            try {
                Vibration.vibrate(100);
                setLoading(true);

                const response = await axios.post('http://192.168.200.23:8000/api/politician_login/', {
                    politician_name: username,
                    politician_password: password,
                });

                if (response.status === 200) {
                    const userId = response.data.user_id;
                    setUserId(userId);
                    login(userId);
                }
            } catch (error) {
                console.error(error);
                setLoginError('Invalid credentials. Please try again.');
                Alert.alert(loginError)
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <LinearGradient
            colors={['#3C4CAC', '#F04393']}
            locations={[0.01, 0.4]}
            style={styles.linearGradient}
        >
            <View style={styles.headerContainer}>
                <Image source={require('../../../assets/tekhnoWhite.png')} style={styles.logo} />
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.title}>Log in</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        value={username}
                        placeholder='Enter username here ...'
                        onChangeText={setUsername}
                        style={styles.input}
                        accessibilityLabel="Username input"
                        accessibilityHint="Enter your username"
                    />
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            value={password}
                            placeholder='Enter password here ...'
                            onChangeText={setPassword}
                            secureTextEntry={isTextSecure}
                            style={styles.passwordInput}
                            accessibilityLabel="Password input"
                            accessibilityHint="Enter your password"
                        />
                        <Pressable onPress={toggleSecureText} style={styles.eyeIcon}>
                            <Feather name={isTextSecure ? "eye-off" : "eye"} size={24} color="black" />
                        </Pressable>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                <Pressable onPress={logInUser} style={styles.loginButton}>
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

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    headerContainer: {
        flex: 0.35,
        paddingTop: height * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        height: width * 0.5,
        width: width * 0.5,
    },
    formContainer: {
        flex: 0.7,
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
    inputContainer: {
        marginVertical: 5,
    },
    label: {
        color: '#424955',
        fontSize: 18,
        fontWeight: '700',
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
    passwordInputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginVertical: 5,
        width: '100%',
        borderWidth: 1,
        borderColor: '#BCC1CA',
        alignItems: 'center',
        borderRadius: 8,
        justifyContent: 'space-between',
    },
    passwordInput: {
        flex: 1,
        padding: 10,
    },
    eyeIcon: {
        paddingRight: 10,
    },
    loginButton: {
        backgroundColor: '#E54394',
        width: '100%',
        borderRadius: 8,
        marginVertical: 10,
        paddingVertical: 10,
        marginTop: height * 0.05
    },
    loginButtonText: {
        fontSize: height * 0.02,
        fontWeight: '500',
        textAlign: 'center',
        color: 'white',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
});

export default AdminLogin;
