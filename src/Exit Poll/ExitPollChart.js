import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const ExitPollChart = () => {
    const screenWidth = Dimensions.get('window').width;

    const data = {
        labels: ['Total Voters', 'Voted', 'Non-Voted'],
        datasets: [
            {
                data: [100, 65, 35],
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 1) => `rgba(0, 0, 229, ${opacity})`,
        barPercentage: 1.6,
        strokeWidth: 2,
        fillShadowGradient: '#0000e5',
        fillShadowGradientOpacity: 1,
        useShadowColorFromDataset: false,
    };

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Votes</Text>
            <BarChart
                data={data}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                withInnerLines={false}
                withHorizontalLabels={false}
                fromZero={true}
                showBarTops={false}
                showValuesOnTopOfBars={true}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
};

export default ExitPollChart;
