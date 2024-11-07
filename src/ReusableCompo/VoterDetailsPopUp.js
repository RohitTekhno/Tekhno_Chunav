import { Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions, Pressable, Alert, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const { width, height } = Dimensions.get('window');

const VoterDetailsPopUp = ({ isModalVisible, setIsModalVisible, selectedVoter }) => {

    const handlePdfIconClick = async (voterId) => {
        try {
            const response = await axios.get(`http://192.168.1.31:8000/api/generate_voter_pdf/${voterId}`, {
                params: { voter_id: voterId },
                responseType: 'arraybuffer',
            });

            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const fileUri = FileSystem.documentDirectory + `voter_${voterId}.pdf`;

            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            //Alert.alert('Success', 'PDF has been saved to your device!');

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing not available on this device.');
            }

        } catch (error) {
            Alert.alert('Error', 'Failed to download the PDF.');
        }
    };


    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };


    const closeModal = () => {
        setIsModalVisible(false);
    }

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={closeModal} >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedVoter && (
                            <>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                    <TouchableOpacity onPress={() => setIsModalVisible(false)} >
                                        <MaterialIcons name="cancel" size={25} color="black" />
                                    </TouchableOpacity>
                                    <Text style={styles.modalTitle}>Voter Details</Text>
                                    <Pressable onPress={() => { handlePdfIconClick(selectedVoter.voter_id) }}>
                                        <FontAwesome5 name="file-pdf" size={25} color="red" />
                                    </Pressable>
                                </View>
                                <View style={styles.detailsContainer}>
                                    <DetailRow label="Name" value={toTitleCase(selectedVoter.voter_name)} />
                                    <DetailRow label="Age" value={selectedVoter.voter_age} />
                                    <DetailRow label="Gender" value={selectedVoter.voter_gender} />
                                    <DetailRow label="Town" value={toTitleCase(selectedVoter.town_name)} />
                                    <DetailRow label="Booth" value={(selectedVoter.booth_name)} />
                                    <DetailRow label="Contact" value={selectedVoter.voter_contact_number} />
                                    <DetailRow label="Caste" value={selectedVoter.voter_cast_name} />
                                    <DetailRow label="Live Status" value={selectedVoter.live_status_type} />
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal >
    );
};

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.modalText}>{label}:</Text>
        <Text style={styles.modalText}>{value}</Text>
    </View>
);

export default VoterDetailsPopUp;


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        height: '70%',
        maxHeight: 500,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    detailsContainer: {
        marginBottom: 30,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'left',
        flex: 1,
        flexWrap: 'wrap',
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'black',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});