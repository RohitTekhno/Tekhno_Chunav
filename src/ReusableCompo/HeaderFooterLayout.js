import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';

const { height } = Dimensions.get('window');

const HeaderFooterLayout = ({ children, headerText, showHeader, showFooter }) => {
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {showHeader &&
                <View style={styles.nav}>
                    <Pressable onPress={handleGoBack}>
                        <Octicons name="chevron-left" size={24} color="black" />
                    </Pressable>

                    <Text style={styles.text}>{headerText}</Text>

                    <Pressable onPress={() => { alert('Convert into PDF..') }}>
                        <FontAwesome6 name="file-pdf" size={22} color="black" />
                    </Pressable>
                </View>

            }
            <View style={styles.content}>
                {children}
            </View>

            {
                showFooter &&
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton} onPress={() => { navigation.navigate('Dashboard') }} >
                        <AntDesign name="home" size={height * 0.03} color="black" />
                        <Text style={styles.footerButtonText}>Dashboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => { navigation.navigate('Towns') }}>
                        <MaterialCommunityIcons name="city-variant-outline" size={height * 0.03} color="black" />
                        <Text style={styles.footerButtonText}>Towns</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Booths')}>
                        <FontAwesome5 name="person-booth" size={height * 0.025} color="black" style={{ padding: 2 }} />
                        <Text style={styles.footerButtonText}>Booth</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Age Wise Voters')}>
                        <MaterialCommunityIcons name="page-next-outline" size={height * 0.03} color="black" />
                        <Text style={styles.footerButtonText}>Voters Age</Text>
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
    },
    footerButton: {
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 10,
        color: 'black',
    }
});

export default HeaderFooterLayout;
