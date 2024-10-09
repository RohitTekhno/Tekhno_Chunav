import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthenticationContext } from '../Admin/Context_Api/AuthenticationContext';
import { TownUserContext } from '../TownUser/ContextApi/TownUserProvider';
import { BoothUserContext } from '../BoothUser/ContextApi/BuserContext';

const { height, width } = Dimensions.get('screen');
const topMargin = height * 0.1;

const Button = ({ onPress, title, backgroundColor }) => (
    <Pressable
        onPress={onPress}
        style={[styles.button, { backgroundColor }]}
    >
        <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
);

const LogOut = () => {
    const navigation = useNavigation();
    const { isTuserAuthenticated, logoutTuser } = useContext(TownUserContext);
    const { logout, isAuthenticated } = useContext(AuthenticationContext);
    const { isBuserAuthenticated, logoutBuser } = useContext(BoothUserContext)

    const handleLogOut = async () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK", onPress: async () => {
                        if (isAuthenticated) {
                            await logout();
                        }

                        if (isTuserAuthenticated) {
                            await logoutTuser();
                        }

                        if (isBuserAuthenticated) {
                            await logoutBuser();
                        }
                    }
                },
            ],
            { cancelable: false }
        );
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
                    <Image
                        source={require('../../assets/bye.png')}
                        style={styles.image}
                    />
                </View>

                <View style={styles.bottomView}>
                    <Button
                        onPress={handleLogOut}
                        title="Log Out"
                        backgroundColor="#E54394"
                    />
                    <Button
                        onPress={() => navigation.goBack()}
                        title="Cancel"
                        backgroundColor="#9095A1"
                    />
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
        flex: 0.5,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentContainer: {
        width: '100%',
        height: height * 0.3,
        alignItems: 'center',
        marginTop: topMargin,
    },
    bigText: {
        color: '#fff',
        fontSize: height * 0.05,
        fontWeight: '600',
    },
    text: {
        color: '#fff',
        fontSize: height * 0.02,
    },
    image: {
        width: width * 0.35,
        height: width * 0.35,
        marginTop: 20,
    },
    bottomView: {
        width: '100%',
        height: height * 0.7,
        padding: 60,
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    button: {
        width: width * 0.5,
        height: 45,
        justifyContent: 'center',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 4,
        margin: 20,
        elevation: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
});
