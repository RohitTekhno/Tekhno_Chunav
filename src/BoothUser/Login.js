
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Vibration, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { BoothUserContext } from './ContextApi/BuserContext';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const API_URL = Constants.manifest?.extra?.apiUrl || 'http://192.168.200.23:8000';

export default function Loginnew({ navigation }) {
  const { setUserName, setUserId, setBooothId } = useContext(UserContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validate = () => {
    let isValid = true;
    if (!name) {
      setNameError('Username is required.');
      isValid = false;
    } else if (name.length < 2) {
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

  const handleLogin = async () => {
    if (validate()) {
      try {
        Vibration.vibrate(100);
        const response = await axios.post(`${API_URL}/api/user_login/`, {
          user_phone: name,
          user_password: password,
        });

        if (response.status === 200) {
          const buserId = response.data.user_id;
          setUserName(name);
          setUserId(buserId);

          console.log('User ID:', buserId);
          navigation.navigate('Dashboard');
        }
      } catch (error) {
        Alert.alert('Error', 'Invalid username or password.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <LinearGradient
      colors={['#3C4CAC', '#F04393']}
      locations={[0, 0.45]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/tekhnowhite.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.loginHeading}>Log In</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username here ..."
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter password here ..."
            placeholderTextColor="#666"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={24} color="#000" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: height * 0.3 - (width * 0.25),
    left: width * 0.6 - (width * 0.25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  loginContainer: {
    width: width,
    height: height * 0.60,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: width * 0.1,
    justifyContent: 'flex-start',
  },
  loginHeading: {
    marginTop: '10%',
    fontSize: 28,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.05,
  },
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  input: {
    height: height * 0.06,
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: height * 0.02,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: height * 0.06,
    borderRadius: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    marginBottom: height * 0.02,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: height * 0.02,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#9095A1',
  },
  loginButton: {
    backgroundColor: '#F04393',
    borderRadius: 10,
    paddingVertical: height * 0.015,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  loginButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
