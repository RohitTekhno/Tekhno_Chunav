import { Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, View, Animated } from 'react-native';
import React, { useRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('screen');

const ProfileChooser = () => {
    const navigation = useNavigation();

    // Create animated values for each button
    const adminScale = useRef(new Animated.Value(1)).current;
    const townUserScale = useRef(new Animated.Value(1)).current;
    const userScale = useRef(new Animated.Value(1)).current;

    // Function to animate the button press
    const handlePressIn = (scaleValue) => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (scaleValue, navigateTo) => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start(() => {
            if (navigateTo) {
                navigation.navigate(navigateTo);
            } else {
                alert("Open Town User Login Screen");
            }
        });
    };

    return (
        <View>
            <ImageBackground
                source={require('../assets/Cover.png')}
                style={{
                    flex: 1,
                    height: height,
                    width: '100%',
                }}>

                <View style={{
                    height: height,
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}>

                    <LinearGradient
                        colors={['#3C4CAC', '#F04393']}
                        locations={[0.3, 1]}
                        style={styles.linearGradient}
                    >
                        <Image
                            source={require('../assets/tekhnowhite.png')}
                            style={{ height: 220, width: 220, alignSelf: 'center' }}
                        />
                    </LinearGradient>

                    <View style={{ alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 30, fontWeight: '600', paddingVertical: 30 }}>
                            Choose Your Profile
                        </Text>

                        <LinearGradient
                            colors={['#3C4CAC', '#F04393']}
                            locations={[0.3, 1]}
                            style={styles.linearGradientBtn}
                        >
                            <Animated.View style={{ transform: [{ scale: adminScale }] }}>
                                <Pressable
                                    style={styles.pressableStyle}
                                    onPressIn={() => handlePressIn(adminScale)}
                                    onPressOut={() => handlePressOut(adminScale, 'AdminMain')}
                                // onPress={() => navigation.navigate('Netalogin')}
                                >
                                    <FontAwesome name="user-circle-o" size={30} color="#3C4CAC" />
                                    <Text style={styles.textStyle}>Admin</Text>
                                </Pressable>
                            </Animated.View>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#3C4CAC', '#F04393']}
                            locations={[0.3, 1]}
                            style={styles.linearGradientBtn}
                        >
                            <Animated.View style={{ transform: [{ scale: townUserScale }] }}>
                                <Pressable
                                    style={styles.pressableStyle}
                                    onPressIn={() => handlePressIn(townUserScale)}
                                    onPressOut={() => handlePressOut(townUserScale, 'Townlogin')}
                                // onPress={() => navigation.navigate('Townlogin')}
                                >
                                    <FontAwesome name="user-circle-o" size={30} color="#3C4CAC" />
                                    <Text style={styles.textStyle}>Town User</Text>
                                </Pressable>
                            </Animated.View>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#3C4CAC', '#F04393']}
                            locations={[0.3, 1]}
                            style={styles.linearGradientBtn}
                        >
                            <Animated.View style={{ transform: [{ scale: userScale }] }}>
                                <Pressable
                                    style={styles.pressableStyle}
                                    onPressIn={() => handlePressIn(userScale)}
                                    onPressOut={() => handlePressOut(userScale, 'Login')}
                                // onPress={() => navigation.navigate('Login')}
                                >
                                    <FontAwesome name="user-circle-o" size={30} color="#3C4CAC" />
                                    <Text style={styles.textStyle}>Booth User</Text>
                                </Pressable>
                            </Animated.View>
                        </LinearGradient>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

export default ProfileChooser;

const styles = StyleSheet.create({
    linearGradient: {
        width: "150%",
        paddingTop: height * 0.1,// '30%',
        borderBottomLeftRadius: width * 0.8,
        borderBottomRightRadius: width * 0.8,
        alignSelf: 'center'
    },
    linearGradientBtn: {
        width: 220,
        paddingHorizontal: 2,
        paddingVertical: 2,
        borderRadius: 8,
        marginVertical: 10
    },
    pressableStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        width: "100%",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 20,
        columnGap: 30
    },
    textStyle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#3C4CAC',
    }
});
