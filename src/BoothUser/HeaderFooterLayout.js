import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BoothUserContext } from './ContextApi/BuserContext';

const { height } = Dimensions.get('window');

const HeaderFooterLayout = ({
    children,
    headerText,
    leftIcon,
    leftIconAction,
    rightIcon,
    rightIconAction,
    showFooter = true,
}) => {
    const navigation = useNavigation();
    const [voterCounts, setVoterCounts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { buserId } = useContext(BoothUserContext);
    const [voterId, setVoterId] = useState([]);
    const [voterNames, setVoterNames] = useState([]);

    const handleLeftIconPress = () => {
        if (leftIconAction) {
            leftIconAction();
        } else {
            navigation.goBack();
        }
    };

    const handleRightIconPress = () => {
        if (rightIconAction) {
            rightIconAction();
        }
    };


    const fetchVotersData = async () => {
        try {
            const url = (`http://192.168.200.23:8000/api/get_voters_by_user_wise/${buserId}/`);
            const response = await axios.get(url);
            if (response.data && response.data.voters) {
                const data = response.data.voters;
                const id = data.map(voter => voter.voter_id);
                const names = data.map(voter => voter.voter_name);
                const contactNumbers = data.map(voter => voter.voter_contact_number);
                const casts = data.map(voter => voter.voter_cast_id);
                const parentNames = data.map(voter => voter.voter_parent_name);
                const ages = data.map(voter => voter.voter_age);
                const genders = data.map(voter => voter.voter_gender);
                const favour = data.map(voter => voter.voter_favour_id);
                const town = data.map(voter => voter.town_name);
                const booth = data.map(voter => voter.booth_name)
                const status = data.map(voter => voter.voter_live_status_id)
                const engaged = data.map(voter => voter.voter_marital_status_id)
                const voted = data.map(voter => voter.voter_vote_confirmation_id)
                setVoterId(id);
                setVoterNames(names);
                navigation.navigate('Voterlist', {
                    buserId,
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
                    voterEngaged: engaged,
                    voterVoted: voted
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
            <View style={styles.nav}>
                <Pressable onPress={handleLeftIconPress}>
                    {leftIcon}
                </Pressable>

                <Text style={styles.text}>{headerText}</Text>

                <Pressable onPress={handleRightIconPress}>
                    {rightIcon}
                </Pressable>
            </View>

            <View style={styles.content}>
                {children}
            </View>

            {showFooter && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Dashboard')}>
                        <MaterialIcons name="home" size={24} color="black" />
                        <Text style={styles.footerButtonText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={fetchVotersData}>
                        <MaterialIcons name="list" size={24} color="black" />
                        <Text style={styles.footerButtonText}>Voter List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('CasteList')}>
                        <MaterialIcons name="sort" size={24} color="black" />
                        <Text style={styles.footerButtonText}>Casts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Polls')}>
                        <MaterialIcons name="poll" size={24} color="black" />
                        <Text style={styles.footerButtonText}>Exit Poll</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Personal')}>
                        <MaterialIcons name="person" size={24} color="black" />
                        <Text style={styles.footerButtonText}>Profile</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
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
        paddingVertical: 20,
    },
    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        // padding: 20,
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
