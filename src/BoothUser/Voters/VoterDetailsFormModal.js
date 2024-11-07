// Modals.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';


const { width, height } = Dimensions.get('window');

// A utility function to scale font sizes
const scaleFontSize = (size) => {
    const scale = width / 375; // Assuming 375 is the base width
    return Math.round(size * scale);
};
export const EditVoterModal = ({
    contactModalVisible,
    closeEditModal,
    language,
    updatedName,
    setUpdatedName,
    updatedParentName,
    setUpdatedParentName,
    updatedContactNumber,
    setUpdatedContactNumber,
    allCasts,
    casteOpen,
    setCasteOpen,
    updatedCaste,
    setUpdatedCaste,
    statusOpen,
    setStatusOpen,
    updatedStatus,
    setUpdatedStatus,
    maritalOpen,
    setMaritalOpen,
    updatedEngaged,
    setUpdatedEngaged,
    updatedAge,
    setUpdatedAge,
    genderOpen,
    setGenderOpen,
    updatedGender,
    setUpdatedGender,
    loading,
    updateVoterDetails,
    openColorLegendModal,
}) => (
    <Modal
        visible={contactModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                        {language === 'en' ? 'Edit Voter Details' : 'मतदार माहिती भरा'}
                    </Text>
                    <TouchableOpacity style={styles.closeCircle} onPress={openColorLegendModal}>
                        <View style={styles.circle}></View>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.modalInput}
                    placeholder={language === 'en' ? "Enter Name" : 'नाव प्रविष्ट करा'}
                    value={updatedName}
                    onChangeText={setUpdatedName}
                />

                <TextInput
                    style={styles.modalInput}
                    placeholder={language === 'en' ? "Enter Parent Name" : 'पालकाचे नाव प्रविष्ट करा'}
                    value={updatedParentName}
                    onChangeText={setUpdatedParentName}
                />

                <TextInput
                    style={styles.modalInput}
                    placeholder={language === 'en' ? "Enter Contact Number" : 'संपर्क क्रमांक प्रविष्ट करा'}
                    value={updatedContactNumber}
                    onChangeText={setUpdatedContactNumber}
                />

                <DropDownPicker
                    items={allCasts}
                    placeholder={language === 'en' ? "Select Caste" : 'जात निवडा'}
                    open={casteOpen}
                    setOpen={setCasteOpen}
                    value={updatedCaste}
                    setValue={setUpdatedCaste}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    zIndex={5000}
                    scrollViewProps={{ nestedScrollEnabled: true }}
                />

                <View style={styles.dropdownRow}>
                    <DropDownPicker
                        items={[
                            { label: 'Alive', value: 1 },
                            { label: 'Dead', value: 2 }
                        ]}
                        placeholder={language === 'en' ? "Select Status" : 'स्थिती निवडा'}
                        open={statusOpen}
                        setOpen={setStatusOpen}
                        value={updatedStatus}
                        setValue={setUpdatedStatus}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={4000}
                    />
                    <DropDownPicker
                        items={[
                            { label: 'Single', value: 1 },
                            { label: 'Married', value: 2 },
                            { label: 'Divorced', value: 3 }
                        ]}
                        placeholder={language === 'en' ? "Marital Status" : 'वैवाहिक स्थिती'}
                        open={maritalOpen}
                        setOpen={setMaritalOpen}
                        value={updatedEngaged}
                        setValue={setUpdatedEngaged}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={4000}
                    />
                </View>

                <View style={styles.dropdownRoww}>
                    <TextInput
                        style={styles.modalInputt}
                        placeholder={language === 'en' ? "Enter Age" : 'वय प्रविष्ट करा'}
                        keyboardType="numeric"
                        value={updatedAge}
                        onChangeText={setUpdatedAge}
                    />
                    <DropDownPicker
                        items={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                            { label: 'Other', value: 'other' }
                        ]}
                        placeholder={language === 'en' ? "Gender" : 'लिंग'}
                        open={genderOpen}
                        setOpen={setGenderOpen}
                        value={updatedGender}
                        setValue={setUpdatedGender}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={3000}
                    />
                </View>

                <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
                        <Text style={styles.cancelButtonText}>
                            {language === 'en' ? 'Cancel' : 'रद्द करा'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.saveButton, loading && { opacity: 0.5 }]}
                        onPress={updateVoterDetails}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>
                                {language === 'en' ? 'Update' : 'अपडेट करा'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

export const ColorLegendModal = ({
    colorLegendModalVisible,
    closeColorLegendModal,
    handleColorSelection,
}) => (
    <Modal
        visible={colorLegendModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeColorLegendModal}
    >
        <View style={styles.overlay}>
            <View style={styles.colorLegendModalContainer}>
                {[
                    { color: 'green', label: 'Favourable' },
                    { color: 'red', label: 'Non-Favourable' },
                    { color: 'yellow', label: 'Doubted' },
                    { color: '#000000', label: 'Pending' },
                    { color: 'skyblue', label: 'Pro' },
                    { color: 'blue', label: 'Pro Plus' },
                ].map((item, index) => (
                    <TouchableOpacity key={index} style={styles.legendItem} onPress={() => handleColorSelection(item.color)}>
                        <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
                        <Text style={styles.label}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    </Modal>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 15
    },





    // header 
    heading: {
        fontSize: scaleFontSize(24),
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },


    // search bar
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: width * 0.03,
        // marginHorizontal:width * 0.05, 
        backgroundColor: '#F5F5F5',
        marginVertical: '3%',
    },

    icon: {
        marginRight: width * 0.02,
    },

    searchInput: {
        flex: 1,
        fontSize: width * 0.04,
        color: '#333',
        paddingVertical: height * 0.01,
    },


    // assign color to multiple voter 
    colorCirclesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
    },
    greenCircle: {
        width: 20,
        height: 20,
        backgroundColor: 'green',
        borderRadius: 15,
    },
    redCircle: {
        width: 20,
        height: 20,
        backgroundColor: 'red',
        borderRadius: 15,
    },
    yellowCircle: {
        width: 20,
        height: 20,
        backgroundColor: '#ffd326',
        borderRadius: 15,
    },

    blueCircle: {
        width: 20,
        height: 20,
        backgroundColor: 'blue',
        borderRadius: 15,
    },

    skyblueCircle: {
        width: 20,
        height: 20,
        backgroundColor: '#a3c6ff',
        borderRadius: 15,
    },

    blackCircle: {
        width: 20,
        height: 20,
        backgroundColor: 'black',
        borderRadius: 15,
    },


    // voter record card


    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        elevation: 7,
        marginVertical: '2%',
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    leftSection: {
        flex: 1,
    },
    indexAndIDContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    indexBox: {
        width: 24,
        height: 24,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'blue',
        width: '15%'
    },
    indexText: {
        color: 'blue',
        fontSize: 14,
        fontWeight: 'bold',
    },
    idText: {
        color: 'blue',
        fontSize: 16,
        fontWeight: 'bold',
    },
    name: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    details: {
        color: '#333',
        fontSize: 14,
        marginTop: 2,
    },
    rightSection: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingVertical: 20,
    },
    editIcon: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    thumbIcon: {
        alignSelf: 'flex-end',
        marginTop: 20,
    },
    colorIndicator: {
        width: '1.5%',
        height: '90%',
        marginRight: '5%',
        borderTopStartRadius: 20,
        borderBottomStartRadius: 20
    },



    // edit voter information modal

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    closeCircle: {
        width: 35,
        height: 35,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 25,
        height: 25,
        backgroundColor: 'black',
        borderRadius: 50,
    },
    modalInput: {
        backgroundColor: '#fff',
        borderColor: '#E2E2E2',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 18,
        color: '#000',
        width: '100%',
        marginBottom: 10,
    },
    modalInputt: {
        backgroundColor: '#fff',
        borderColor: '#E2E2E2',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 18,
        color: '#000',
        width: '45%',
        marginBottom: 10,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderColor: '#E2E2E2',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '100%',
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        borderColor: '#E2E2E2',
        marginBottom: 15,
    },
    dropdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        width: '100%',
        marginBottom: '3%',
        marginTop: '3%'
    },
    dropdownRoww: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        width: '100%',
        marginBottom: '3%',
    },
    rowItem: {
        width: '45%',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#ff69b4',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '45%',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderColor: '#ff69b4',
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '45%',
    },
    cancelButtonText: {
        color: '#ff69b4',
        fontSize: 16,
        fontWeight: 'bold',
    },





    // color modal



    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    colorLegendModalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    colorCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        color: '#333',
    },


    // assign cast to multiple 

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    selectionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        // paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#8d93fc',
        padding: 5,
        borderRadius: 10,
        // marginHorizontal: 5,  
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const pickerSelectStyles = StyleSheet.create({
    casteDropdown: {
        inputAndroid: {
            fontSize: 16,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#E2E2E2',
            borderRadius: 10,
            color: 'black',
            paddingRight: 30,
        },
    },
    statusDropdown: {
        inputAndroid: {
            fontSize: 16,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            color: 'black',
            paddingRight: 30,
            width: '100%',
        },
    },
    maritalStatusDropdown: {
        inputAndroid: {
            fontSize: 16,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            color: 'black',
            paddingRight: 30,
            width: '100%',
        },
    },
    ageDropdown: {

        inputAndroid: {
            fontSize: 16,
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            color: 'black',
            paddingRight: 30,
            width: '100%',
            flex: 1,
        },
    },
    genderDropdown: {
        inputAndroid: {
            fontSize: 16,
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            color: 'black',
            paddingRight: 30,
            width: '100%',
            flex: 1,
        },
    },
});