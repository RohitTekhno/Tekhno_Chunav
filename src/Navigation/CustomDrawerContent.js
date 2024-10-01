import { Alert, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { Pressable } from 'react-native';


const { height, width } = Dimensions.get('screen')
const CustomDrawerContent = ({ navigation }) => {
    const handleCloseDrawer = () => {
        navigation.closeDrawer();
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" translucent={true} />
            <LinearGradient
                colors={['#3C4CAC', '#F04393']}
                locations={[0.6, 1]}
                style={styles.gradient}
            >
                <View style={{
                    flexDirection: 'row', alignItems: 'center', marginTop: 20,
                    justifyContent: 'space-between', marginBottom: 20
                }}>
                    <Pressable style={{ marginLeft: 10 }} onPress={handleCloseDrawer}>
                        <Icon name='chevron-left' size={25} color={'white'} />
                    </Pressable>
                    <Text style={{
                        color: 'white', fontWeight: '500', fontSize: 15,
                        textAlign: 'center',
                    }}>Welcome to</Text>
                    <View />
                </View>


                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/tekhnoWhite.png')}
                        style={styles.image}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <View style={{ height: 100 }}>

                    </View>
                    <TouchableOpacity onPress={() => { navigation.navigate("About Us") }} style={styles.drawerList} >
                        <Entypo name="info-with-circle" size={25} color="white" />
                        <Text style={styles.drawerListText}>About Us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigation.navigate("Contact Us") }} style={styles.drawerList} >
                        <MaterialIcons name="contact-phone" size={25} color="white" />
                        <Text style={styles.drawerListText}>Contact Us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigation.navigate("Help") }} style={styles.drawerList} >
                        <FontAwesome5 name="hands-helping" size={25} color="white" />
                        <Text style={styles.drawerListText}>Help</Text>
                    </TouchableOpacity>

                </View>

                <Pressable style={styles.logOutView} onPress={() => { navigation.navigate('LogOut') }}>
                    <Feather name="log-out" size={25} color="#3C4CAC" />
                    <Text style={{ color: '#3C4CAC', fontSize: 20 }}>Log Out</Text>
                </Pressable>
            </LinearGradient >
        </View >
    );
};

export default CustomDrawerContent;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 25,
    },
    gradient: {
        flex: 1,
        padding: 10,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 40,
        borderBottomWidth: 2,
        borderColor: 'white',
    },
    image: {
        width: width * 0.3,
        height: height * 0.15,
    },
    drawerList: {
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 10,
        paddingLeft: 15,
        marginVertical: height * 0.01,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: width * 0.05,
        borderRadius: 8,
    },
    drawerListText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '400'
    },
    logOutView: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        alignSelf: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 15,
        columnGap: 15
    },
});
