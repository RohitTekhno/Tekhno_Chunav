import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BoothUser_Context } from '../Context_Api/BoothUser_Context';
import { ActivityIndicator } from 'react-native';

const LogInScreen = () => {
    const navigation = useNavigation()
    const { setBoothUserId } = useContext(BoothUser_Context)
    const [Username, setUsername] = useState("User")
    const [password, setPassword] = useState("Buser")
    const [isTextSecure, setTextSecure] = useState(true)
    const [isLoading, setLoading] = useState(false)


    const toggleSecureText = () => {
        setTextSecure(!isTextSecure)
    }

    const LogInUser = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`http://192.168.200.23:8000/api/user_login/`, {
                "user_name": Username,
                "user_password": password
            })
            if (response.status === 200) {
                setBoothUserId(response.data.user_id)
                // alert(response.data.message)
                // setUsername(null)
                // setPassword(null)
                navigation.navigate('Dashboard')
            }
        } catch (error) {
            console.error(error);
            console.warn('Invalid credentials');
        }
        setLoading(false)
    }

    return (
        <>
            <LinearGradient
                colors={['#3C4CAC', '#F04393']}
                locations={[0.01, 0.4]}
                style={styles.linearGradient}
            >

                <View style={{
                    flex: 0.35, paddingTop: "20%",
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image source={require('../Assets/tekhnoWhite.png')}
                        style={{ height: 220, width: 220 }} />
                </View>

                <View style={{
                    flex: 0.7, backgroundColor: 'white', borderTopRightRadius: 15,
                    borderTopLeftRadius: 15, paddingHorizontal: 20, paddingVertical: 30
                }}>

                    <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center' }}>Log in</Text>
                    <View style={{ paddingVertical: 30 }}>
                        <View style={{ marginVertical: 5 }}>
                            <Text style={{
                                color: '#424955', fontSize: 18, fontWeight: '700'
                            }}>Username</Text>
                            <TextInput
                                value={Username}
                                placeholder='Enter username here ...'
                                onChangeText={setUsername}
                                style={{
                                    width: '100%', borderWidth: 1, borderColor: '#BCC1CA',
                                    paddingVertical: 10, borderRadius: 8, marginVertical: 5,
                                    paddingHorizontal: 20,
                                }} />
                        </View>


                        <View style={{ marginVertical: 5 }}>
                            <Text style={{
                                color: '#424955', fontSize: 18, fontWeight: '700'
                            }}>Password</Text>
                            <View style={{
                                flexDirection: 'row', paddingHorizontal: 10, marginVertical: 5,
                                width: '100%', borderWidth: 1, borderColor: '#BCC1CA',
                                alignContent: 'center', alignItems: 'center', borderRadius: 8,
                                justifyContent: 'space-between'
                            }}>
                                <TextInput
                                    value={password}
                                    placeholder='Enter password here ...'
                                    onChangeText={setPassword}
                                    secureTextEntry={isTextSecure}
                                    style={{
                                        flex: 1, padding: 10
                                    }} />
                                <Pressable onPress={toggleSecureText} style={{ paddingRight: 10 }}>
                                    {
                                        isTextSecure ?
                                            <Feather name="eye-off" size={24} color="black" /> :
                                            <Feather name="eye" size={24} color="black" />
                                    }
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    <Pressable onPress={LogInUser}
                        style={{
                            backgroundColor: '#E54394', width: '100%', height: 50,
                            borderRadius: 8, marginVertical: 10, paddingVertical: 10
                        }}>
                        {!isLoading ?
                            <Text style={{
                                fontSize: 18, fontWeight: '500',
                                textAlign: 'center', color: 'white',
                                textAlignVertical: 'center'
                            }}>Log in</Text> :
                            <ActivityIndicator color={'white'} size={'large'} />
                        }
                    </Pressable>
                </View>

            </LinearGradient>
        </>
    )
}

export default LogInScreen

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
})