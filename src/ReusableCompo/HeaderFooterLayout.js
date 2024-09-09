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

    const handleNotificationBtn = () => {
        Alert.alert("Notification Pressed...");
    };


    const fetchVotersData = async () => {
        try {
            const url = `http://192.168.200.23:8000/api/get_voters_by_user_wise/${userId}/`;
            const response = await axios.get(url);
            if (response.data && response.data.voters) {
                const data = response.data.voters;
                const id = data.map(voter => voter.voter_id);
                const names = data.map(voter => voter.voter_name);
                const contactNumbers = data.map(voter => voter.voter_contact_number);
                const casts = data.map(voter => voter.voter_cast);
                const parentNames = data.map(voter => voter.voter_parent_name);
                const ages = data.map(voter => voter.voter_age);
                const genders = data.map(voter => voter.voter_gender);
                const favour = data.map(voter => voter.voter_favour_id);
                const town = data.map(voter => voter.town_name);
                const booth = data.map(voter => voter.booth_name)
                const status = data.map(voter => voter.voter_live_status_id)
                setVoterId(id);
                setVoterNames(names);
                navigation.navigate('Voterlist', {
                    userId,
                    voterId: id,
                    voterNames: names,
                    voterContactNumbers: contactNumbers,
                    voterCasts: casts,
                    voterParentNames: parentNames,
                    voterAges: ages,
                    voterGenders: genders,
                    voterfavour: favour,
                    voterTown: town,
                    voterBooth: booth,
                    voterStatus: status,
                });
            } else {
                Alert.alert('Error', 'Unexpected data format.');
            }
        } catch (error) {
            Alert.alert('Error', `Failed to fetch voter names: ${error.message}`);
        }
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
                        <AntDesign name="home" size={24} color="black" />
                        <Text style={styles.footerButtonText}>Dashboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Users List')}>
                        <MaterialIcons name="list" size={24} color="black" />
                        <Text style={styles.footerButtonText}>User List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => { navigation.navigate('Towns') }}>
                        <MaterialCommunityIcons name="city-variant-outline" size={24} color="black" />
                        <Text style={styles.footerButtonText}>Towns</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Booths')}>
                        <FontAwesome5 name="person-booth" size={18} color="black" style={{ padding: 2 }} />
                        <Text style={styles.footerButtonText}>Booth</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Profile')}>
                        <MaterialIcons name="person" size={24} color="black" />
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
        height: height * 0.03
    },
    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        // backgroundColor: 'white',
        // paddingHorizontal: 15,
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
        height: height * 0.07,
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
