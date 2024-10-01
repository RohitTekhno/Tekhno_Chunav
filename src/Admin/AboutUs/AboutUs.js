import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ColorLegendModal from '../../ReusableCompo/ColorLegendModal'
import { StatusBar } from 'expo-status-bar';

const AboutUs = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <StatusBar />
            <TouchableOpacity style={styles.openButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.openButtonText}>Show Color Modal</Text>
            </TouchableOpacity>
            <ColorLegendModal isVisible={modalVisible}
                closeModal={() => { setModalVisible(false) }} onSelect={(item) => {
                }} />
        </View>
    )
}

export default AboutUs

const styles = StyleSheet.create({
    openButton: {
        height: 40,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    openButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})