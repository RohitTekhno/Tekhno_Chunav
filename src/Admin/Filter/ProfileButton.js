import React, { useState } from 'react';
import { View, Pressable, Modal, Text, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';


const { width, height } = Dimensions.get('screen');

const ProfileButton = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const handleToggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <Pressable onPress={handleToggleModal} style={styles.button}>
            <AntDesign
                name={modalVisible ? "appstore1" : "appstore-o"}
                size={24}
                color="black"
            />
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <ScrollView style={styles.modalContent}>
                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Family'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Family</Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Urban Towns'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Urban Towns</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Rural Towns'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Rural Towns</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Towns Users'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Town User</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Booth Users'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Booth User</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Ward Users'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Ward Users</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('LocationWise Voters'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Location-wise Voters</Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Age Wise Voters'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Age-wise Voters</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Castwise'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Cast-wise Voters</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('GenderWise'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Gender-wise Voters</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Booth Analysis'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Booth Analysis</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Town Analysis'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Town Analysis</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Registration'); handleCloseModal(); }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalText}>Registeration</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalButton, { marginBottom: 5 }]}
                                    onPress={() => { navigation.navigate('WardUser Register'); handleCloseModal(); }}
                                >
                                    <Text style={styles.modalText}>Ward User Register</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </Pressable >
    );
};

const styles = StyleSheet.create({
    button: {
        borderColor: "#3C4CAC",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    modalContent: {
        position: 'absolute',
        top: 55,
        right: 10,
        backgroundColor: '#e6f2ff',
        borderRadius: 10,
        padding: 5,
        width: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 20,
        // height: 570,
    },
    modalButton: {
        backgroundColor: '#e6eeff',
        width: '100%',
        padding: 7,
        paddingHorizontal: 15,
        borderRadius: 3,
        marginVertical: 2,
        // alignItems: 'center',
    },
    modalText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileButton;
