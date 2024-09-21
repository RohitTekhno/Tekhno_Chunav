import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as Progress from 'react-native-progress'; // Import the entire Progress namespace

const ProgressCircleWithMargin = ({ progressValue, circleProgessColor, unfilledColor }) => {
    const value = progressValue / 100;
    const formattedValue = Math.round(progressValue); // Format value to show as a percentage

    return (
        <View style={styles.container}>
            <View style={[styles.progressCircle, { borderColor: circleProgessColor }]}>
                <Progress.Circle
                    progress={value}
                    size={120}
                    borderWidth={0}
                    color={circleProgessColor}
                    thickness={25}
                    unfilledColor={unfilledColor}
                    strokeCap={'butt'}
                />
                <Text style={[styles.text, { color: circleProgessColor }]}>{formattedValue}%</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressCircle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 150,
        // backgroundColor: 'grey',
    },
    text: {
        fontSize: 25,
        fontWeight: 'bold',
        position: 'absolute',
    },
});

export default ProgressCircleWithMargin;
