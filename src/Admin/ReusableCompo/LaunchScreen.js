import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const LaunchScreen = () => {
    return (
        <LinearGradient
            colors={['#3C4CAC', '#F04393']}
            locations={[0.65, 1]}
            style={styles.linearGradient}
        >
            <View style={styles.imageContainer}>
                <ImageBackground
                    source={require('../Assets/Cover.png')}
                    imageStyle={{ borderBottomLeftRadius: 370, borderBottomRightRadius: 370 }}
                    style={styles.backgroundImage}
                >
                    <View style={styles.container}>
                        <Image
                            source={require('../Assets/tekhnoblue.png')}
                            style={{ width: 100, height: 100 }}
                        />
                        <Text style={{ fontSize: 16, fontWeight: '700' }}>Your gateway to get vote prediction</Text>
                    </View>
                </ImageBackground>
            </View>

            <View style={styles.smallLogoView}>
                <Image
                    source={require('../Assets/tempLogo.png')}
                    style={{ width: 70, height: 70, alignSelf: 'center', marginVertical: 15 }}
                />
            </View>
        </LinearGradient >
    );
}

export default LaunchScreen;

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: '65%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    backgroundImage: {
        width: '130%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
        marginLeft: -120
    },
    container: {
        width: '130%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
        borderBottomLeftRadius: 370,
        borderBottomRightRadius: 370,
        marginLeft: 140,
        paddingTop: 300,
    },
    text: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
    },

    smallLogoView: {
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: (width * 0.3) / 2,
        backgroundColor: 'white',
        left: 130,
        top: '60%',
        borderWidth: 3,
        borderColor: '#3C4CAC',
    }
});
