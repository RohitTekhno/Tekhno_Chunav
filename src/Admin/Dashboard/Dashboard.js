import { Alert, Dimensions, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import VotingBarStats from './VotingBarStats';
import CastDonotStat from './CastDonotStat';
import { LanguageContext } from '../../ContextApi/LanguageContext';


const { height, width } = Dimensions.get('screen');

const Dashboard = () => {
    const navigation = useNavigation();
    const { language } = useContext(LanguageContext);
    // const { userId } = useContext(AuthenticationContext);
    const [votersCounter, setVoterCounter] = useState({
        TotalVoters: null,
        Favorable: null,
        Non_Favorable: null,
        Doubted: null,
        Non_Voted: null
    });
    const [refreshing, setRefreshing] = useState(false)
    const [totalVoters, setTotalVoters] = useState('00000');
    const [totalTowns, setTotalTowns] = useState('000');
    const [totalBooths, setTotalBooths] = useState('000');
    const [totalVoted, setTotalVoted] = useState('000');
    const [totalNVoted, setNTotalVoted] = useState('000');

    const getVotersByUserwise = async () => {
        try {
            const result1 = await axios.get(`http://192.168.1.8:8000/api/voter_favour_counts/`);
            setVoterCounter({
                TotalVoters: result1.data.Total_Voters,
                Favorable: result1.data.Favourable,
                Non_Favorable: result1.data.Non_Favourable,
                Doubted: result1.data.Not_Confirmed,
                Non_Voted: result1.data.Pending
            });
        } catch (error) {
            Alert.alert("Failed to fetch data ", error.toString ? error.toString() : 'Unknown error');
        }
    };

    // NEW API call for voted and non-voted count
    const getVotedAndNonVotedCount = async () => {
        try {
            const response = await axios.get('http://192.168.1.8:8000/api/get_voted_and_non_voted_count/');
            setTotalVoted(response.data.voted_count.toString());
            setNTotalVoted(response.data.non_voted_count.toString());
        } catch (error) {
            Alert.alert('Error fetching voted and non-voted count:', error.toString ? error.toString() : 'Unknown error');
        }
    };

    const getAllCounts = () => {
        axios.get('http://192.168.1.8:8000/api/voter_count/')
            .then(response => {
                setTotalVoters(response.data.count.toString());
            })
            .catch(error => {
                Alert.alert('Error fetching total voters count:', error.toString ? error.toString() : 'Unknown error');
            });

        axios.get('http://192.168.1.8:8000/api/towns/')
            .then(response => {
                setTotalTowns(response.data.length.toString());
            })
            .catch(error => {
                Alert.alert('Error fetching total towns:', error.toString ? error.toString() : 'Unknown error');
            });

        axios.get('http://192.168.1.8:8000/api/booths/')
            .then(response => {
                setTotalBooths(response.data.length.toString());
            })
            .catch(error => {
                Alert.alert('Error fetching total booths count:', error.toString ? error.toString() : 'Unknown error');
            });

    }

    useEffect(() => {
        getAllCounts()
        getVotersByUserwise();
        getVotedAndNonVotedCount();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        getAllCounts()
        getVotersByUserwise();
        getVotedAndNonVotedCount();
        setRefreshing(false);
    }

    return (
        <ScrollView style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.headerContainer}>
                <Text style={styles.title}>{language === 'en' ? 'Washim Constituency' : 'वाशिम विधानसभा'}</Text>
                <Pressable onPress={() => { navigation.navigate('Total Voters') }} style={{
                    height: height * 0.1, borderRadius: 10,
                    paddingVertical: '2%',
                    width: '100%',
                }}>
                    <LinearGradient
                        colors={['#3C4CAC', '#F04393']}
                        locations={[0.3, 1]}
                        style={styles.gradient}
                    >
                        <Text style={styles.gradientText}>{language === 'en' ? 'Total Voters' : 'एकूण मतदार'}</Text>
                        <Text style={styles.gradientText}>{totalVoters}</Text>
                    </LinearGradient>
                </Pressable>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statsRow}>
                    <Pressable onPress={() => { navigation.navigate('Towns') }} style={[styles.statsBox, styles.statsBoxBlue]}>
                        <Text style={styles.statsLabel}>{language === 'en' ? 'Total Towns' : 'एकूण गांव किंवा शहरे'}</Text>
                        <Text style={styles.statsValue}>{totalTowns}</Text>
                    </Pressable>

                    <Pressable onPress={() => { navigation.navigate('Booths'); }} style={[styles.statsBox, styles.statsBoxGreen]}>
                        <Text style={styles.statsLabel}>{language === 'en' ? 'Total Booths' : 'एकूण बूथ'}</Text>
                        <Text style={styles.statsValue}>{totalBooths}</Text>
                    </Pressable>
                </View>

                <View style={styles.statsRow}>
                    <Pressable style={[styles.statsBox, styles.statsBoxYellow]} onPress={() => { navigation.navigate('Voted') }}>
                        <Text style={styles.statsLabel}>{language === 'en' ? 'Total Voted' : 'एकूण मतदान'}</Text>
                        <Text style={styles.statsValue}>{totalVoted}</Text>
                    </Pressable>

                    <Pressable style={[styles.statsBox, styles.statsBoxCyan]} onPress={() => { navigation.navigate('Nvoted') }}>
                        <Text style={styles.statsLabel}>{language === 'en' ? 'Total Non-Voted' : 'एकूण मतदान नाही'}</Text>
                        <Text style={styles.statsValue}>{totalNVoted}</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.votingStatsContainer}>
                <View style={styles.votingStatsBox}>
                    <VotingBarStats
                        TotalVoters={votersCounter.TotalVoters}
                        Favorable={votersCounter.Favorable}
                        Non_Favorable={votersCounter.Non_Favorable}
                        Doubted={votersCounter.Doubted}
                        Non_Voted={votersCounter.Non_Voted}
                    />
                </View>

                <View style={styles.votingStatsBox}>
                    <CastDonotStat />
                </View>
            </View>
        </ScrollView>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        backgroundColor: 'white',
    },
    headerContainer: {
        height: height * 0.15,
        width: "100%",
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginVertical: 5,
        color: '#3C4CAC'
    },
    gradient: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '2%',
    },
    gradientText: {
        fontSize: width * 0.05,
        fontWeight: '600',
        textAlign: 'center',
        color: 'white',
    },
    statsContainer: {
        height: height * 0.20,
        marginVertical: "3%"
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: height * 0.08,
        marginVertical: "1.8%",
        columnGap: 15
    },
    statsBox: {
        flex: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3
    },
    statsBoxBlue: {
        backgroundColor: '#DAE3FF',
    },
    statsBoxGreen: {
        backgroundColor: '#D3FFDB',
    },
    statsBoxYellow: {
        backgroundColor: '#FFEFB2',
    },
    statsBoxCyan: {
        backgroundColor: '#B8F7FE',
    },
    statsLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    statsValue: {
        fontSize: width * 0.05,
        fontWeight: '700',
    },
    votingStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: height * 0.38,
    },
    votingStatsBox: {
        flex: 1,
        borderWidth: 0.1,
        borderRadius: 1,
        marginHorizontal: '1%',
        paddingVertical: "2%"
    },
});
