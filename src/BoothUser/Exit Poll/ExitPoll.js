import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import ResponsivePoll from './ResponsivePoll';
import ProgressCircleWithMargin from './ProgressCircleWithMargin';
import axios from 'axios';
import HeaderFooterLayout from '../HeaderFooterLayout';
import { BoothUserContext } from '../ContextApi/BuserContext';


const { height, width } = Dimensions.get('window');

export default function ExitPoll() {
    const navigation = useNavigation();
    const { buserId } = useContext(BoothUserContext);
    const [votersCounter, setVoterCounter] = useState({
        TotalVoters: null,
        Favorable: null,
        Non_Favorable: null,
        Doubted: null,
    });

    const getVotersByUserwise = async () => {
        try {
            const result = await axios.get(`http://192.168.1.31:8000/api/get_voters_by_user_wise/${buserId}/`);
            const totalVoterDetails = result.data.voters;

            const totalVoterCount = totalVoterDetails.length;
            const favorableCount = totalVoterDetails.filter(voter => voter.voter_favour_id === 1).length;
            const non_Favorable = totalVoterDetails.filter(voter => voter.voter_favour_id === 2).length;
            const Doubted = totalVoterDetails.filter(voter => voter.voter_favour_id === 3).length;

            setVoterCounter({
                TotalVoters: totalVoterCount,
                Favorable: favorableCount,
                Non_Favorable: non_Favorable,
                Doubted: Doubted,
            });
        } catch (error) {
            Alert.alert("Failed to fetch data ", error);
        }
    };

    useEffect(() => {
        if (buserId) {
            getVotersByUserwise();
        }
    }, [buserId]);

    return (
        <HeaderFooterLayout headerText="Exit Poll">
            <View style={styles.container}>
                <View style={styles.graphContainer}>
                    <ResponsivePoll
                        TotalVoters={votersCounter.TotalVoters}
                        Favorable={votersCounter.Favorable}
                        Non_Favorable={votersCounter.Non_Favorable}
                        Doubted={votersCounter.Doubted}
                    />
                </View>
                <View style={styles.statisticsContainer}>
                    <Text style={styles.statisticsTitle}>Statistics</Text>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressItem}>
                            <ProgressCircleWithMargin
                                progressValue={60}
                                circleProgessColor={'#00BDD6'}
                                unfilledColor={'#A6F5FF'}
                            />
                            <Text style={styles.progressLabel}>Support Margin</Text>
                        </View>
                        <View style={styles.progressItem}>
                            <ProgressCircleWithMargin
                                progressValue={45}
                                circleProgessColor={'#8353E2'}
                                unfilledColor={'#D9CBF6'}
                            />
                            <Text style={styles.progressLabell}>Against Margin</Text>
                        </View>
                    </View>
                </View>
            </View>
        </HeaderFooterLayout>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'flex-start',
    },
    graphContainer: {
        flex: 1,
        marginBottom: 30,
        // backgroundColor: 'red'

    },
    statisticsContainer: {
        flex: 1,
        // backgroundColor: 'red'
    },
    statisticsTitle: {
        fontSize: height * 0.03,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    progressItem: {
        // marginBottom: 20,
        alignItems: 'center',
    },
    progressLabel: {
        marginTop: 15,
        fontSize: height * 0.02,
        fontWeight: 'bold',
        color: '#00BDD6',
    },
    progressLabell: {
        marginTop: 5,
        fontSize: height * 0.02,
        fontWeight: 'bold',
        color: '#8353E2',
    },
});
