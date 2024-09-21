import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import VotingBarStats from './VotingBarStats';
import CastDonotStat from './CastDonotStat';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import { AuthenticationContext } from '../Context_Api/AuthenticationContext';

const { height, width } = Dimensions.get('screen');

const Dashboard = () => {
    const navigation = useNavigation();
    const { userId } = useContext(AuthenticationContext);
    const [votersCounter, setVoterCounter] = useState({
        TotalVoters: null,
        Favorable: null,
        Non_Favorable: null,
        Doubted: null,
        Non_Voted: null
    });
    const [totalVoters, setTotalVoters] = useState('00000');
    const [totalTowns, setTotalTowns] = useState('000');
    const [totalBooths, setTotalBooths] = useState('000');

    const getVotersByUserwise = async () => {
        try {
            const result1 = await axios.get(`http://192.168.200.23:8000/api/voter_favour_counts/`)
            setVoterCounter({
                TotalVoters: result1.data.Total_Voters,
                Favorable: result1.data.Favourable,
                Non_Favorable: result1.data.Non_Favourable,
                Doubted: result1.data.Not_Confirmed,
                Non_Voted: result1.data.Pending
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        axios.get('http://192.168.200.23:8000/api/voter_count/')
            .then(response => {
                setTotalVoters(response.data.count.toString());
            })
            .catch(error => {
                console.error('Error fetching total voters count:', error);
            });

        axios.get('http://192.168.200.23:8000/api/towns/')
            .then(response => {
                setTotalTowns(response.data.length.toString());
            })
            .catch(error => {
                console.error('Error fetching total towns:', error);
            });

        axios.get('http://192.168.200.23:8000/api/booths/')
            .then(response => {
                setTotalBooths(response.data.length.toString());
            })
            .catch(error => {
                console.error('Error fetching total booths count:', error);
            });
    }, []);

    useEffect(() => {
        if (userId) {
            getVotersByUserwise();
        }
    }, [userId]);

    return (
        <HeaderFooterLayout showHeader={false} showFooter={true}  >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Washim Constituency</Text>
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
                            <Text style={styles.gradientText}>Total Voters Count</Text>
                            <Text style={styles.gradientText}>{totalVoters}</Text>
                        </LinearGradient>
                    </Pressable>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <Pressable onPress={() => { navigation.navigate('Towns') }} style={[styles.statsBox, styles.statsBoxBlue]}>
                            <Text style={styles.statsLabel}>Total Town Count</Text>
                            <Text style={styles.statsValue}>{totalTowns}</Text>
                        </Pressable>

                        <Pressable onPress={() => {
                            navigation.navigate('Booths');
                        }} style={[styles.statsBox, styles.statsBoxGreen]}>
                            <Text style={styles.statsLabel}>Total Booth Count</Text>
                            <Text style={styles.statsValue}>{totalBooths}</Text>
                        </Pressable>
                    </View>

                    <View style={styles.statsRow}>
                        <Pressable style={[styles.statsBox, styles.statsBoxYellow]}>
                            <Text style={styles.statsLabel}>Total Voted Count</Text>
                            <Text style={styles.statsValue}>000</Text>
                        </Pressable>

                        <Pressable style={[styles.statsBox, styles.statsBoxCyan]}>
                            <Text style={styles.statsLabel}>Total Non-Voted Count</Text>
                            <Text style={styles.statsValue}>000</Text>
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
            </View>
        </HeaderFooterLayout >
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        // height: height * 0.9,
        marginBottom: height * 0.05,
        paddingHorizontal: 15,
        backgroundColor: 'white',
    },
    headerContainer: {
        height: height * 0.15,
        width: "100%",
        justifyContent: 'center',
    },
    title: {
        fontSize: width * 0.04,
        fontWeight: '500',
        textAlign: 'center',
        marginVertical: 5,
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
        fontSize: width * 0.03,
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
