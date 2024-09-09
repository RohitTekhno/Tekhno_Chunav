import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');

const VotingBarStats = ({ TotalVoters = 0, Favorable = 0, Non_Favorable = 0, Doubted = 0, Non_Voted = 0 }) => {
    const perPercent = TotalVoters > 0 ? TotalVoters / 100 : 1;

    const data = [
        { label: 'Favorable', value: Math.round(Favorable / perPercent) },
        { label: 'Non Favorable', value: Math.round(Non_Favorable / perPercent) },
        { label: 'Doubted', value: Math.round(Doubted / perPercent) },
        { label: 'Non Voted', value: Math.round(Non_Voted / perPercent) },
    ];

    const colorData = [
        { labelL: 'red', value: '#34A853' },
        { labelL: 'red', value: '#EA4335' },
        { labelL: 'red', value: '#FBBC04' },
        { labelL: 'red', value: '#545454' },
    ];

    const animatedValues = data.map((item) => useSharedValue(0));

    data.forEach((item, index) => {
        animatedValues[index].value = withTiming(isNaN(item.value) ? 0 : item.value, { duration: 1000 });
    });

    return (
        <View style={styles.container}>
            <View style={styles.barGraphContainer}>
                <Text style={styles.graphTitle}>Voting Statistics</Text>
                <View style={styles.barChart}>
                    {data.map((item, index) => {
                        const animatedStyle = useAnimatedStyle(() => ({
                            height: animatedValues[index].value * 2,
                            backgroundColor: colorData[index].value,
                        }));
                        return (
                            <View key={index} style={styles.barContainer}>
                                <Text style={styles.barText}>{item.value}%</Text>
                                <Animated.View style={[styles.bar, animatedStyle]} />
                            </View>
                        );
                    })}
                </View>

                <View style={styles.legendContainer}>
                    <View style={styles.legendColumn}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#34A853' }]} />
                            <Text style={styles.legendLabel}>Favorable</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#EA4335' }]} />
                            <Text style={styles.legendLabel}>Against</Text>
                        </View>
                    </View>

                    <View style={styles.legendColumn}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#FBBC04' }]} />
                            <Text style={styles.legendLabel}>Doubted</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#545454' }]} />
                            <Text style={styles.legendLabel}>Non-Voted</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default VotingBarStats;

// (Styles remain the same)


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 10,
        // backgroundColor: 'red'
    },
    barGraphContainer: {
        width: '100%',
    },
    graphTitle: {
        fontSize: height * 0.017,
        fontWeight: '700',
    },
    barChart: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        // backgroundColor: 'red',
        alignItems: 'flex-end',
        height: height * 0.25,
    },
    barContainer: {
        alignItems: 'center',
        marginVertical: 20,
        // backgroundColor: 'green'
    },
    barText: {
        textAlign: 'center',
        fontSize: 10,
    },
    bar: {
        width: width * 0.07,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    legendColumn: {
        flexDirection: 'column',
        marginVertical: 5,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 5,
        marginVertical: 5,
    },
    legendColor: {
        height: 10,
        width: 10,
        borderRadius: 10,
    },
    legendLabel: {
        fontSize: height * 0.014,
        color: 'black'
    },
});
