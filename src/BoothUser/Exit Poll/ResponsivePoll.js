import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function ResponsivePoll({ TotalVoters, Favorable, Non_Favorable, Doubted }) {
    const perPercent = TotalVoters ? TotalVoters / 100 : 1; // Prevent division by zero
    const TotalVoterPer = Math.round(TotalVoters / perPercent);
    const FavorableVoterPer = Math.round(Favorable / perPercent);
    const Non_FavorableVoterPer = Math.round(Non_Favorable / perPercent);
    const DoubtedPer = Math.round(Doubted / perPercent);

    const totalVoterHeight = useRef(new Animated.Value(0)).current;
    const favorableHeight = useRef(new Animated.Value(0)).current;
    const nonFavorableHeight = useRef(new Animated.Value(0)).current;
    const doubtedHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!isNaN(TotalVoterPer)) {
            Animated.timing(totalVoterHeight, {
                toValue: TotalVoterPer * 2,
                duration: 1000,
                useNativeDriver: false,
            }).start();
        }

        if (!isNaN(FavorableVoterPer)) {
            Animated.timing(favorableHeight, {
                toValue: FavorableVoterPer * 2,
                duration: 1000,
                useNativeDriver: false,
            }).start();
        }

        if (!isNaN(Non_FavorableVoterPer)) {
            Animated.timing(nonFavorableHeight, {
                toValue: Non_FavorableVoterPer * 2,
                duration: 1000,
                useNativeDriver: false,
            }).start();
        }

        if (!isNaN(DoubtedPer)) {
            Animated.timing(doubtedHeight, {
                toValue: DoubtedPer * 2,
                duration: 1000,
                useNativeDriver: false,
            }).start();
        }
    }, [TotalVoterPer, FavorableVoterPer, Non_FavorableVoterPer, DoubtedPer]);

    // Calculate the maximum height for the bars
    const maxHeight = Math.max(TotalVoterPer, FavorableVoterPer, Non_FavorableVoterPer, DoubtedPer) * 2;

    // Determine the number of lines and their spacing
    const numLines = 5;
    const lineSpacing = maxHeight / numLines;

    const lines = [];
    for (let i = 1; i <= numLines; i++) {
        lines.push(
            <View
                key={i}
                style={[styles.line, { top: maxHeight - i * lineSpacing }]}
            >
                <Text style={styles.lineLabel}>{i}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>Votes</Text>
            <View style={styles.barChart}>
                {lines}
                <View style={styles.barItem}>
                    <Animated.View style={[styles.bar, { height: totalVoterHeight }]} />
                    <Text style={styles.barLabel}>{TotalVoterPer ? `${TotalVoterPer}%` : '0%'}</Text>
                </View>
                <View style={styles.barItem}>
                    <Animated.View style={[styles.bar, { height: favorableHeight }]} />
                    <Text style={styles.barLabel}>{FavorableVoterPer ? `${FavorableVoterPer}%` : '0%'}</Text>
                </View>
                <View style={styles.barItem}>
                    <Animated.View style={[styles.bar, { height: nonFavorableHeight }]} />
                    <Text style={styles.barLabel}>{Non_FavorableVoterPer ? `${Non_FavorableVoterPer}%` : '0%'}</Text>
                </View>
                <View style={styles.barItem}>
                    <Animated.View style={[styles.bar, { height: doubtedHeight }]} />
                    <Text style={styles.barLabel}>{DoubtedPer ? `${DoubtedPer}%` : '0%'}</Text>
                </View>
            </View>
            <View style={styles.barLabels}>
                <Text style={styles.barLabelText}>Total Voters</Text>
                <Text style={styles.barLabelText}>Favorable</Text>
                <Text style={styles.barLabelText}>Non-Favorable</Text>
                <Text style={styles.barLabelText}>Doubted</Text>
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // marginVertical: '5%',
        // marginHorizontal:'5%',
        marginRight: '8%',
        // backgroundColor: 'green',
    },
    graphTitle: {
        fontSize: 20,
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
        position: 'relative',
        marginTop: 50
    },
    barItem: {
        alignItems: 'center',
    },
    bar: {
        width: 50,
        backgroundColor: '#4069E5',
    },
    barLabel: {
        marginTop: 5,
        color: '#000',
        fontWeight: 'bold',
    },
    barLabels: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    barLabelText: {
        // width: ,
        textAlign: 'center',
        color: '#6E7787',
        fontSize: 14,
    },
    line: {
        position: 'absolute',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#D3D3D3', // Light gray color for faint lines
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 5,
    },
    lineLabel: {
        color: '#6E7787',
        fontSize: 12,
    },
});
