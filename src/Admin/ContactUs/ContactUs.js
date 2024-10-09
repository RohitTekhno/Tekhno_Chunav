import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Linking, Pressable } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
const { height } = Dimensions.get('screen');
const topMargin = height * 0.1;
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';


const ContactUs = () => {

   


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
                    <Text style={styles.bigText}>GET IN TOUCH!</Text>
                    <Text style={styles.text}>Always within your reach</Text>
                    <Image source={require('../Assets/getInTouch.png')}
                        style={{ width: 200, height: 200, marginVertical: 20 }}
                    />
                </View>

                <View style={styles.bottomView} >
                    <View style={{ marginVertical: 10 }}>
                        <Text style={styles.sectionTitle}>Contact No.</Text>
                        <Pressable style={styles.infoContainer} onPress={() => { sendWhatsAppMessage('8668363146') }}>
                            <Ionicons name="call" size={18} color="black" />
                            <Text>8668363146</Text>
                        </Pressable>
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={styles.sectionTitle}>Email</Text>
                        <View style={styles.infoContainer}>
                            <Octicons name="mail" size={18} color="black" style={{ marginTop: 2 }} />
                            <Text>tekhno.marketing@gmail.com</Text>
                        </View>
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={styles.sectionTitle}>Website</Text>
                        <TouchableOpacity style={styles.infoContainer}
                            onPress={() => Linking.openURL('https://tekhchunavs.blogspot.com')}
                        >
                            <AntDesign name="earth" size={18} color="black" style={{ marginTop: 2 }} />
                            <Text>https://tekhchunavs.blogspot.com</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </LinearGradient>
        </SafeAreaView>
    );
};

export default ContactUs;

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
        fontSize: 30,
        fontWeight: 'bold',
    },
    text: {
        color: '#fff',
    },
    bottomView: {
        width: '100%',
        height: height * 0.7,
        padding: 30,
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
