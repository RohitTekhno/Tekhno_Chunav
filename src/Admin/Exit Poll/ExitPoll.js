import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import ResponsivePoll from './ResponsivePoll'
import ProgressCircleWithMargin from './ProgressCircleWithMargin'
import { BoothUser_Context } from '../Context_Api/BoothUser_Context';
import axios from 'axios';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';


const ExitPoll = () => {
    const navigation = useNavigation();

    const { boothUserId } = useContext(BoothUser_Context)
    const [votersCounter, setVoterCounter] = useState({
        'TotalVoters': null,
        "Favorable": null,
        "Non_Favorable": null,
        "Doubted": null
    })



    const getVotersByUserwise = async () => {
        try {
            const result = await axios.get(`http://192.168.200.23:8000/api/get_voters_by_user_wise/${boothUserId}/`)
            const totalVoterDetails = result.data.voters;

            const totalVoterCount = totalVoterDetails.length;
            const favorableCount = totalVoterDetails.filter(voter => voter.voter_favour_id === 1).length
            const non_Favorable = totalVoterDetails.filter(voter => voter.voter_favour_id === 2).length
            const Doubted = totalVoterDetails.filter(voter => voter.voter_favour_id === 3).length


            setVoterCounter({
                "TotalVoters": totalVoterCount,
                "Favorable": favorableCount,
                "Non_Favorable": non_Favorable,
                "Doubted": Doubted
            })
        } catch (error) {
            console.error(error);

        }
    }

    useEffect(() => {
        if (boothUserId) {
            getVotersByUserwise()
        }
    }, [boothUserId])

    return (
        <HeaderFooterLayout headerText="Exit Poll">
            <View>
                <View>
                    <ResponsivePoll TotalVoters={votersCounter.TotalVoters}
                        Favorable={votersCounter.Favorable}
                        Non_Favorable={votersCounter.Non_Favorable}
                        Doubted={votersCounter.Doubted}
                    />
                </View>
                <View style={{ paddingVertical: 30, backgroundColor: 'red', flex: 0.5 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Statistics</Text>
                    <View style={{
                        borderWidth: 1, borderColor: '#DEE1E6',
                        margin: 10, padding: 15, width: '100%', alignSelf: 'center'
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#00BDD6' }}>Support Margin</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#8353E2' }}>Against Margin</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <ProgressCircleWithMargin progressValue={60}
                                circleProgessColor={'#00BDD6'}
                                unfilledColor={'#A6F5FF'} />

                            < ProgressCircleWithMargin progressValue={45}
                                circleProgessColor={'#8353E2'}
                                unfilledColor={'#D9CBF6'} />
                        </View>
                    </View>
                </View>
            </View>
        </HeaderFooterLayout >
    )
}

export default ExitPoll

const styles = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
})