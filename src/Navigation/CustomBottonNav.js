import { Alert, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const CustomTUserBottomTabs = ({ children, headerText, showHeader, showFooter }) => {

    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {children}
            </View>

            {showFooter &&
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton} onPress={() => { navigation.navigate('Dashboard') }} >
                        <AntDesign name="home" size={height * 0.03} color="black" />
                        <Text style={styles.footerButtonText}>Dashboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => { navigation.navigate('Town Voters List') }}>
                        <FontAwesome name="list-alt" size={height * 0.03} color="black" />
                        <Text style={styles.footerButtonText}>Voters List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Town Booths')}>
                        <FontAwesome5 name="person-booth" size={height * 0.025} color="black" style={{ padding: 2 }} />
                        <Text style={styles.footerButtonText}>Booths</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Booth Users')}>
                        <FontAwesome6 name="users" size={height * 0.03} color="black" />
                        <Text style={styles.footerButtonText}>Booth Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Profile')}>
                        <MaterialIcons name="person" size={height * 0.032} color="black" />
                        <Text style={styles.footerButtonText}>Profile</Text>
                    </TouchableOpacity>
                </View>
            }
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 30,
        height: height * 0.04,
    },
    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: height * 0.08,
        // marginBottom: height * 0.04,

    },
    footerButton: {
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 10,
        color: 'black',
    }
});


export default CustomTUserBottomTabs

