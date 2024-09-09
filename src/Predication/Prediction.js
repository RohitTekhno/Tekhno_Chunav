import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import VoterComponents from './VoterComponents';
import TopNavCompo from '../ReusableCompo/TopNavCompo';

const Prediction = () => {
    const navigation = useNavigation();

    return (
        <View style={{ paddingHorizontal: 20, paddingVertical: 50 }}>
            <StatusBar style='auto' />
            <TopNavCompo navigation={navigation} ScreenName={"Prediction"} />

            <View style={{ marginVertical: 30 }}>
                <VoterComponents boxColor={'#DEDEDE'} voterType={'Total Voters'} voterCount={'3881'}>
                    <AntDesign name="team" size={30} color="grey" />
                </VoterComponents>
                <VoterComponents boxColor={'#D9F4E9'} voterType={'Favourable Voters'} voterCount={'31'} >
                    <AntDesign name="heart" size={30} color="green" />
                </VoterComponents>
                <VoterComponents boxColor={'#FDDDDD'} voterType={'Opposition Voters'} voterCount={'81'}>
                    <Entypo name="cross" size={40} color="red" />
                </VoterComponents>

                <VoterComponents boxColor={'#FFFAE1'} voterType={'Doubted Voters'} voterCount={'43'} >
                    {/* <Fontisto name="confused" size={24} color="orange" /> */}
                    <AntDesign name="exclamationcircle" size={30} color="orange" />
                </VoterComponents>
                <VoterComponents boxColor={'#ECEEF7'} voterType={'Pending'} voterCount={'255'} >
                    <MaterialIcons name="pending-actions" size={30} color="#c26dbc" />
                </VoterComponents>
            </View>

            <LinearGradient
                colors={['#3C4CAC', '#F04393']}
                start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
                style={styles.box}
            >
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>
                        Prediction 78%
                    </Text>
                </View>
            </LinearGradient>
        </View>
    );
};

export default Prediction;

const styles = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    box: {
        borderRadius: 5,
        padding: 2,
        // marginVertical: 25
    },
    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 3,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
        padding: 15,
    }


});
