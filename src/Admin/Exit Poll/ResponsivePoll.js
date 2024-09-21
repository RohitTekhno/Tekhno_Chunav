import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'

const ResponsivePoll = ({ TotalVoters, Favorable, Non_Favorable, Doubted }) => {
    const perPercent = TotalVoters ? TotalVoters / 100 : 1; // Prevent division by zero
    const TotalVoterPer = Math.round(TotalVoters / perPercent)
    const FavorableVoterPer = Math.round(Favorable / perPercent)
    const Non_FavorableVoterPer = Math.round(Non_Favorable / perPercent)
    const DoubtedPer = Math.round(Doubted / perPercent)

    const totalVoterHeight = useRef(new Animated.Value(0)).current
    const favorableHeight = useRef(new Animated.Value(0)).current
    const nonFavorableHeight = useRef(new Animated.Value(0)).current
    const doubtedHeight = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (!isNaN(TotalVoterPer)) {
            Animated.timing(totalVoterHeight, {
                toValue: TotalVoterPer * 2,
                duration: 1000,
                useNativeDriver: false,
            }).start()
        }

        if (!isNaN(FavorableVoterPer)) {
            Animated.timing(favorableHeight, {
                toValue: FavorableVoterPer * 2,
                duration: 1000,
                useNativeDriver: false,
            }).start()
        }

        if (!isNaN(Non_FavorableVoterPer)) {
            Animated.timing(nonFavorableHeight, {
                toValue: Non_FavorableVoterPer * 2,
                duration: 1000,
                useNativeDriver: false,
            }).start()
        }

        if (!isNaN(DoubtedPer)) {
            Animated.timing(doubtedHeight, {
                toValue: DoubtedPer * 2,
                duration: 1000,
                useNativeDriver: false,
            }).start()
        }
    }, [TotalVoterPer, FavorableVoterPer, Non_FavorableVoterPer, DoubtedPer])

    return (
        <View style={styles.container}>
            <View style={styles.barGraphContainer}>
                <Text style={styles.graphTitle}>Votes</Text>
                <View style={styles.barChart}>
                    <View>
                        <Text style={{ textAlign: 'center', padding: 5 }}>{TotalVoterPer ? TotalVoterPer : 0}%</Text>
                        <Animated.View style={[styles.bar, { height: totalVoterHeight }]} />
                    </View>
                    <View>
                        <Text style={{ textAlign: 'center', padding: 5 }}>{FavorableVoterPer ? FavorableVoterPer : 0}%</Text>
                        <Animated.View style={[styles.bar, { height: favorableHeight }]} />
                    </View>
                    <View>
                        <Text style={{ textAlign: 'center', padding: 5 }}>{Non_FavorableVoterPer ? Non_FavorableVoterPer : 0}%</Text>
                        <Animated.View style={[styles.bar, { height: nonFavorableHeight }]} />
                    </View>
                    <View>
                        <Text style={{ textAlign: 'center', padding: 5 }}>{DoubtedPer ? DoubtedPer : 0}%</Text>
                        <Animated.View style={[styles.bar, { height: doubtedHeight }]} />
                    </View>
                </View>
                <View style={styles.barLabels}>
                    <Text style={styles.barLabel}>Total Voters</Text>
                    <Text style={styles.barLabel}>Favor- able</Text>
                    <Text style={styles.barLabel}>Non- Favorable</Text>
                    <Text style={styles.barLabel}>Doubted</Text>
                </View>
            </View>
        </View>
    )
}

export default ResponsivePoll

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10
    },
    barGraphContainer: {
        width: '100%',
    },
    graphTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    barChart: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 200,
        marginVertical: 20,
    },
    bar: {
        width: 50,
        backgroundColor: '#4069E5',
    },
    barLabels: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    barLabel: {
        width: 50,
        color: '#6E7787',
        fontSize: 14,
        textAlign: 'center'
    },
})
