import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Dimensions, TouchableOpacity, ActivityIndicator, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderFooterLayout from './HeaderFooterLayout';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BoothUserContext } from './ContextApi/BuserContext';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';



const { height, width } = Dimensions.get('window');


export default function Polls() {


    const navigation = useNavigation();
    const [voterCounts, setVoterCounts] = useState({ total: 0, ours: 0, against: 0, doubted: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { buserId } = useContext(BoothUserContext);

    // const buserId = 123; // Replace with your actual buserId

    const fetchVoterData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://192.168.200.23:8000/api/get_voters_by_user_wise/${buserId}/`);

            const voters = response.data.voters || [];
            const totalVoters = voters.length;
            console.log(totalVoters);

            const ours = voters.filter(voter => voter.voter_favour_id === 1).length;
            console.log(ours);
            const against = voters.filter(voter => voter.voter_favour_id === 2).length;
            console.log(against);

            const doubted = voters.filter(voter => voter.voter_favour_id === 3).length;
            console.log(doubted);

            const pending = totalVoters - (ours + against + doubted);
            console.log(pending);

            setVoterCounts({
                total: totalVoters,
                ours: ours,
                against: against,
                doubted: doubted,
                pending: pending,
            });
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (buserId) {
            fetchVoterData();
        }
    }, [buserId]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleNotificationBtn = () => {
        Alert.alert("Notification Pressed...");
    };



    const VoterBox = ({ boxColor, voterType, voterCount, icon }) => (
        <View style={styles.voterBox}>
            <View style={[styles.iconContainer, { backgroundColor: boxColor }]}>
                {icon}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.voterType}>{voterType}</Text>
                <Text style={styles.voterCount}>{voterCount}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const predictionPercentage = ((voterCounts.ours / voterCounts.total) * 100).toFixed(2);



    return (
        <HeaderFooterLayout
            leftIcon={<MaterialIcons name="chevron-left" size={24} color="black" onPress={handleGoBack} />}
            headerText="Prediction">

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <View style={styles.voterComponentsContainer}>
                    <VoterBox
                        boxColor={'#DEDEDE'}
                        voterType={'Total Voters'}
                        voterCount={voterCounts.total.toString()}
                        icon={<AntDesign name="team" size={30} color="grey" />}
                    />
                    <VoterBox
                        boxColor={'#D9F4E9'}
                        voterType={'Favourable Voters'}
                        voterCount={voterCounts.ours.toString()}
                        icon={<AntDesign name="heart" size={30} color="green" />}
                    />
                    <VoterBox
                        boxColor={'#FDDDDD'}
                        voterType={'Opposition Voters'}
                        voterCount={voterCounts.against.toString()}
                        icon={<Entypo name="cross" size={30} color="red" />}
                    />
                    <VoterBox
                        boxColor={'#FFFAE1'}
                        voterType={'Doubted Voters'}
                        voterCount={voterCounts.doubted.toString()}
                        icon={<AntDesign name="exclamationcircle" size={30} color="orange" />}
                    />
                    <VoterBox
                        boxColor={'#ECEEF7'}
                        voterType={'Pending'}
                        voterCount={voterCounts.pending.toString()}
                        icon={<MaterialIcons name="pending-actions" size={30} color="#c26dbc" />}
                    />
                </View>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('ExitPoll')} style={{
                paddingHorizontal: 20
            }}>
                <LinearGradient
                    colors={['#3C4CAC', '#F04393']}
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 0.0, y: 1.0 }}
                    style={styles.predictionBox}
                >
                    <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>
                            Prediction {predictionPercentage}%
                        </Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>

        </HeaderFooterLayout>
    );
}

const styles = StyleSheet.create({
    voterComponentsContainer: {
        marginVertical: 20,
        paddingHorizontal: 20
    },
    voterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#DEDEDE',
    },
    iconContainer: {
        marginRight: 20,
        padding: 10,
        borderRadius: 5,
    },
    textContainer: {
        flex: 1,
    },
    voterType: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    voterCount: {
        fontSize: 16,
        color: '#666',
    },
    predictionBox: {
        borderRadius: 5,
        padding: 2,
        marginTop: 25,
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
    },
});
