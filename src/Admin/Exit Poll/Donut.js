// Donut.js
import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

// Define the screen width
const screenWidth = Dimensions.get('window').width;

const Donut = ({ data }) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ marginBottom: 10 }}>Donut Chart</Text>
            <PieChart
                data={data}
                width={screenWidth * 0.8} // Responsive width
                height={220}
                chartConfig={{
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                    strokeWidth: 2, // optional
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
        </View>
    );
};

export default Donut;
