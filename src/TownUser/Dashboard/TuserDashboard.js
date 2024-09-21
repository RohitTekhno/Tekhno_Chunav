import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import TownVotingBarStats from './TownVotingBarStats';
import { TownUserContext } from '../ContextApi/TownUserProvider';
import CustomTUserBottomTabs from '../../Navigation/CustomBottonNav';

const { height, width } = Dimensions.get('screen');

const Towndash = () => {
    const navigation = useNavigation();
    const { userId } = useContext(TownUserContext);
    const [totalVoters, setTotalVoters] = useState(0);
    const [finalTotalVoters, setFinalTotalVoters] = useState(0);
    const [totalVoted, setTotalVoted] = useState(0);
    const [finalTotalVoted, setFinalTotalVoted] = useState(0);
    const [totalNonVoted, setTotalNonVoted] = useState(0);
    const [finalTotalNonVoted, setFinalTotalNonVoted] = useState(0);
    const [totalBoothsCount, setTotalBoothsCount] = useState(0);
    const [finalTotalBoothsCount, setFinalTotalBoothsCount] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [finalTotalUsers, setFinalTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async (url, setter, finalSetter) => {
        try {
            const response = await axios.get(url);
            const count = response.data.length;
            setter(count);
            finalSetter(count);
        } catch (error) {
            console.error(`Error fetching data from :`, error);
            setError(error.response ? error.response.data.message : 'Error fetching data');
        }
    };

    useEffect(() => {
        if (userId) {
            fetchData(`http://192.168.200.23:8000/api/get_voter_list_by_town_user/${userId}`, setTotalVoters, setFinalTotalVoters);
            fetchData(`http://192.168.200.23:8000/api/get_booth_names_by_town_user/${userId}`, setTotalBoothsCount, setFinalTotalBoothsCount);
            fetchData(`http://192.168.200.23:8000/api/town_user_id/${userId}/confirmation/1/`, setTotalVoted, setFinalTotalVoted);
            fetchData(`http://192.168.200.23:8000/api/town_user_id/${userId}/confirmation/2/`, setTotalNonVoted, setFinalTotalNonVoted);
            fetchData(`http://192.168.200.23:8000/api/get_booth_users_by_town_user/${userId}/`, setTotalUsers, setFinalTotalUsers);
        }
    }, [userId]);

    const animateCount = (finalCount, setter) => {
        const duration = 2000; // Duration in milliseconds
        const intervalTime = 50; // Time between each increment in milliseconds
        const increments = Math.ceil(duration / intervalTime);
        const incrementValue = Math.ceil(finalCount / increments);

        const interval = setInterval(() => {
            setter(prev => {
                if (prev + incrementValue >= finalCount) {
                    clearInterval(interval);
                    return finalCount;
                }
                return prev + incrementValue;
            });
        }, intervalTime);

        return () => clearInterval(interval);
    };

    useEffect(() => {
        animateCount(finalTotalVoters, setTotalVoters);
    }, [finalTotalVoters]);

    useEffect(() => {
        animateCount(finalTotalVoted, setTotalVoted);
    }, [finalTotalVoted]);

    useEffect(() => {
        animateCount(finalTotalNonVoted, setTotalNonVoted);
    }, [finalTotalNonVoted]);

    useEffect(() => {
        animateCount(finalTotalBoothsCount, setTotalBoothsCount);
    }, [finalTotalBoothsCount]);

    useEffect(() => {
        animateCount(finalTotalUsers, setTotalUsers);
    }, [finalTotalUsers]);

    const handlePress = (destination) => {
        navigation.navigate(destination);
    };

    return (
        <CustomTUserBottomTabs showFooter={true}>
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Washim Constituency</Text>
                    <View style={styles.gradientContainer}>
                        <Pressable onPress={() => handlePress('Town Voters List')}>
                            <LinearGradient
                                colors={['#3C4CAC', '#F04393']}
                                locations={[0.3, 1]}
                                style={styles.gradient}
                            >
                                <Text style={styles.gradientText}>Total Voters</Text>
                                <Text style={styles.gradientText}>{totalVoters}</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <Pressable onPress={() => handlePress('Town Booths')} style={[styles.statsBox, styles.statsBoxBlue]}>
                            <Text style={styles.statsLabel}>Total Booths</Text>
                            <Text style={styles.statsValue}>{totalBoothsCount}</Text>
                        </Pressable>

                        <Pressable onPress={() => handlePress('Booth Users')} style={[styles.statsBox, styles.statsBoxGreen]}>
                            <Text style={styles.statsLabel}>Total Users</Text>
                            <Text style={styles.statsValue}>{totalUsers}</Text>
                        </Pressable>
                    </View>

                    <View style={styles.statsRow}>
                        <Pressable style={[styles.statsBox, styles.statsBoxYellow]} onPress={() => handlePress('Total Voted')}>
                            <Text style={styles.statsLabel}>Total Voted</Text>
                            <Text style={styles.statsValue}>{totalVoted}</Text>
                        </Pressable>

                        <Pressable style={[styles.statsBox, styles.statsBoxCyan]} onPress={() => handlePress('Total Non Voted')}>
                            <Text style={styles.statsLabel}>Total Non-Voted</Text>
                            <Text style={styles.statsValue}>{totalNonVoted}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.votingStatsContainer}>
                    <View style={styles.votingStatsBox}>
                        <TownVotingBarStats />
                    </View>
                </View>
            </ScrollView>
        </CustomTUserBottomTabs>
    );
};

export default Towndash;


const styles = StyleSheet.create({
    container: {
        height: height * 0.93,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    headerContainer: {
        width: "100%",
        justifyContent: 'center',
    },
    title: {
        fontSize: height * 0.02,
        fontWeight: '500',
        textAlign: 'center',
        marginVertical: 5,
    },
    gradientContainer: {
        height: height * 0.1,
        borderRadius: 10,
        paddingVertical: '2%',
        width: '100%',
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
        marginVertical: "3%",
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: height * 0.08,
        marginVertical: "1.8%",
        columnGap: width * 0.035
    },
    statsBox: {
        flex: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
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
        fontSize: width * 0.04,
        fontWeight: '500',
    },
    statsValue: {
        fontSize: width * 0.05,
        fontWeight: '700',
    },
    votingStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: height * 0.4,
    },
    votingStatsBox: {
        flex: 1,
        borderWidth: 0.1,
        borderRadius: 1,
        marginHorizontal: '1%',
        paddingVertical: "2%",
    },
});
