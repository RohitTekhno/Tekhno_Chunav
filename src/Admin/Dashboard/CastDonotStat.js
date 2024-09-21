
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import PieChart from 'react-native-pie-chart';

const { height, width } = Dimensions.get('screen');

const CastDonutStat = () => {
    const widthAndHeight = width * 0.28;
    const [series, setSeries] = useState([1, 1, 1]);
    const sliceColor = ['orange', 'green', '#545454'];

    const getReligionwiseData = async () => {
        try {
            const result = await axios.get('http://192.168.200.23:8000/api/religion_count/');
            setSeries([
                result.data.Hindu || 0,
                result.data.Muslim || 0,
                result.data['Not Defined'] || 1
            ]);
        } catch (error) {
            console.error('Error fetching religion-wise data:', error);
        }
    };

    useEffect(() => {
        getReligionwiseData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Religionwise Statistics</Text>

            <View style={{ marginTop: '25%' }}>
                <PieChart
                    widthAndHeight={widthAndHeight}
                    series={series}
                    sliceColor={sliceColor}
                    doughnut={true}
                    coverRadius={0.5}
                    coverFill={'#FFF'}
                />
            </View>

            <View style={styles.legendContainer}>
                <View style={styles.legendColumn}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#F8700F' }]} />
                        <Text style={styles.legendLabel}>Hindu : {series[0]}</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: 'green' }]} />
                        <Text style={styles.legendLabel}>Muslim : {series[1]}</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#545454' }]} />
                        <Text style={styles.legendLabel}>Not Defined : {series[2]}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CastDonutStat;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    title: {
        fontSize: height * 0.017,
        fontWeight: '700',
    },
    legendContainer: {
        flexDirection: 'row',
        width: width * 0.4,
        justifyContent: 'space-between',
        marginTop: '8%',
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
        color: 'black',

    },
});
