import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Linking, Pressable, Alert } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthenticationContext } from '../Context_Api/AuthenticationContext';
const { height } = Dimensions.get('screen');
const topMargin = height * 0.1;


const LogOut = () => {
    const navigation = useNavigation();
    const { logout } = useContext(AuthenticationContext)

    const handleLogOut = async () => {
        logout()
    }
    const handleGoBack = () => {
        navigation.goBack()
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#3C4CAC', '#F04393']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0.1, 1]}
                style={styles.gradient}
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.bigText}>Log Out?</Text>
                    <Text style={styles.text}>Are you sure you want to log out?</Text>
                    <Image source={require('../Assets/bye.png')}
                        style={{ width: 140, height: 140, marginVertical: 20 }}
                    />
                </View>

                <View style={styles.bottomView}>
                    <Pressable onPress={handleLogOut}
                        style={{
                            width: 150,
                            backgroundColor: '#E54394',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            paddingVertical: 10,
                            paddingHorizontal: 40,
                            borderRadius: 4,
                            margin: 20
                        }}>
                        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Log Out</Text>
                    </Pressable>

                    <Pressable onPress={handleGoBack} style={{
                        width: 150,
                        backgroundColor: '#9095A1',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        paddingVertical: 10,
                        paddingHorizontal: 40,
                        borderRadius: 4,
                        margin: 20
                    }}>
                        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Cancel</Text>
                    </Pressable>

                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default LogOut;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 0.45,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentContainer: {
        width: '100%',
        height: height * 0.325,
        alignItems: 'center',
        marginTop: topMargin,
    },
    bigText: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '600',
    },
    text: {
        color: '#fff',
        fontSize: 16
    },
    bottomView: {
        width: '100%',
        height: height * 0.7,
        padding: 60,
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    sectionTitle: {
        color: '#3C4CAC',
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderColor: '#9095A1',
        columnGap: 10,
        padding: 5,
    },
});
