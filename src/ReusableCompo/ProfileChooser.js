import { Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
const { height, width } = Dimensions.get('screen');

const ProfileChooser = () => {
    const navigation = useNavigation();
    return (
        <View>
            <ImageBackground
                source={require('../Assets/Cover.png')}
                style={{
                    flex: 1,
                    height: height, width: '100%',
                }}>

                <View style={{
                    height: height, width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}>

                    <LinearGradient
                        colors={['#3C4CAC', '#F04393']}
                        locations={[0.3, 1]}
                        style={styles.linearGradient}
                    >
                        <Image
                            source={require('../Assets/tekhnoWhite.png')}
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
                            <Pressable style={styles.pressableStyle} onPress={() => { navigation.navigate('LogInScreen') }}>
                                <FontAwesome name="user-circle-o" size={30} color="#3C4CAC" />
                                <Text style={styles.textStyle}>Admin</Text>
                            </Pressable>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#3C4CAC', '#F04393']}
                            locations={[0.3, 1]}
                            style={styles.linearGradientBtn}
                        >
                            <Pressable style={styles.pressableStyle} onPress={() => { alert("Open Town User Login Screen") }}>
                                <FontAwesome name="user-circle-o" size={30} color="#3C4CAC" />
                                <Text style={styles.textStyle}>Town User</Text>
                            </Pressable>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#3C4CAC', '#F04393']}
                            locations={[0.3, 1]}
                            style={styles.linearGradientBtn}
                        >
                            <Pressable style={styles.pressableStyle} onPress={() => { navigation.navigate('LogInScreen') }}>
                                <FontAwesome name="user-circle-o" size={30} color="#3C4CAC" />
                                <Text style={styles.textStyle}>User</Text>
                            </Pressable>
                        </LinearGradient>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}

export default ProfileChooser;

const styles = StyleSheet.create({
    linearGradient: {
        width: "150%",
        paddingTop: 50,
        borderBottomLeftRadius: width * 0.8,
        borderBottomRightRadius: width * 0.8,
        alignSelf: 'center'
    },
    linearGradientBtn: {
        width: 200,
        paddingHorizontal: 2,
        paddingVertical: 2,
        borderRadius: 8,
        marginVertical: 10
    },
    pressableStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        width: 196,
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
})
