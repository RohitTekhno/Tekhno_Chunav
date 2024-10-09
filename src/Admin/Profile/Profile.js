import { Alert, Dimensions, Image, View, StyleSheet, Text, } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import TopNavCompo from '../ReusableCompo/TopNavCompo';
import CustomeTextInput from './CustomeTextInput';
import { StatusBar } from 'expo-status-bar';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';

const { width, height } = Dimensions.get('screen')
const Profile = () => {
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack()
    };

    const handleNotificationBtn = () => {
        Alert.alert("Notification Pressed...")
    }

    return (
        <HeaderFooterLayout headerText={'Profile'} showHeader={false} showFooter={true}>
            <View style={{ height: height * 0.3 }}>
                <LinearGradient
                    colors={['#3C4CAC', '#F04393']}
                    locations={[0.2, 1]}
                    style={styles.gradient}
                >
                    <TopNavCompo navigation={navigation} ScreenName={'Profile'} colorName={'white'} />
                </LinearGradient>
            </View>
            <View style={{ height: height * 0.45 }}>
                <View style={styles.profileDetailsView}>
                    <View style={styles.profileImageView}>
                        <View style={styles.profileImageCircle}>
                            <Image source={require('../Assets/Cover.png')} style={styles.profileImage} />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold',marginTop:10 }}>Politician</Text>
                        <Text>User</Text>
                    </View>
                    <View style={{
                        width: "100%",
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 10,
                    }}>
                        <CustomeTextInput
                            label={'User Name : '}
                            valueDetails={'Politician'}
                            styles={styles.profileTextInput}
                            readValue={true}
                        />

                        <CustomeTextInput
                            label={'Contact No : '}
                            valueDetails={'7894561230'}
                            styles={styles.profileTextInput}
                            readValue={true}
                        />

                        <CustomeTextInput
                            label={'Constituency : '}
                            valueDetails={'Washim'}
                            styles={styles.profileTextInput}
                            readValue={true}
                        />
                    </View>
                </View>
            </View >

            <View style={{ height: height * 0.1 }}>
                <Pressable style={styles.logOutButton} onPress={() => { navigation.navigate('LogOut') }}>
                    <Text style={styles.logOutButtonTxt}>Log Out</Text>
                </Pressable>
            </View>
        </HeaderFooterLayout>
    );
};

export default Profile;

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        padding: 10,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    profileDetailsView: {
        height: height * 0.45,
        width: "90%",
        elevation: 5,
        borderRadius: 10,
        marginTop: '-17%',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    profileImageView: {
        width: '100%',
        height: height * 0.13,
        borderBottomWidth: 1,
        borderBlockColor: 'black',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 10,
    },
    profileImageCircle: {
        width: width * 0.28,
        height: width * 0.28,
        backgroundColor: 'white',
        borderWidth: 2,
        borderRadius: width,
        borderColor: '#3C4CAC',
        marginTop: - height * 0.1,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },
    profileTextInput: {
        width: width * 0.8,
        height: height * 0.06,
        borderRadius: 8,
        paddingStart: 20,
        marginVertical: 8,
        backgroundColor: 'rgba(236, 238, 247, 1)',
        fontSize: 18,
        color: 'black'
    },
    logOutButton: {
        width: width * 0.8,
        height: 50,
        backgroundColor: '#F04393',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
        borderRadius: 7,
    },
    logOutButtonTxt: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center'
    }
});
