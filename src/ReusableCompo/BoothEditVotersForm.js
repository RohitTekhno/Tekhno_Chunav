import { Dimensions, Modal, StyleSheet, Text, TextInput, View, TouchableOpacity, Pressable, Keyboard, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ColorLegendModal from './ColorLegendModal';

const { height, width } = Dimensions.get('screen');

export default function BoothEditVoterForm({ isVisible, onClose, selectedVoter, onEditVoter }) {
    const [name, setName] = useState('');
    const [parentName, setParentName] = useState('');
    const [contact, setContact] = useState(null);
    const [voterFavourType, setVoterFavourType] = useState(null)
    const [caste, setCaste] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [maritalStatus, setMaritalStatus] = useState(null);
    const [gender, setGender] = useState(null);
    const [age, setAge] = useState(null)
    const [loading, setLoading] = useState(false);
    const [casteOptions, setCasteOptions] = useState([]);
    const [townName, setTownName] = useState(null);
    const [boothName, setBoothName] = useState(null);

    const [openCaste, setOpenCaste] = useState(false);
    const [openCurrentStatus, setOpenCurrentStatus] = useState(false);
    const [openMaritalStatus, setOpenMaritalStatus] = useState(false);
    const [openGender, setOpenGender] = useState(false);
    const [isThumbSelected, setThumbSelected] = useState(false);
    const [color, setColor] = useState('black');
    const [modalVisible, setModalVisible] = useState(false);

    const statusOptions = [{ label: 'Alive', value: 1 }, { label: 'Dead', value: 2 }];
    const maritalOptions = [{ label: 'Single', value: 1 }, { label: 'Married', value: 2 }];
    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];


    const handleSelectedVoterType = (item) => {
        console.log(item);

        setVoterFavourType(item.id);
        setTypeColor(item.id)

        const editedVoter = {
            "voter_id": selectedVoter.voter_id,
            "voter_name": name,
            "voter_favour_id": Number(item.id),
        }

        onEditVoter(editedVoter)

        const voterId = selectedVoter.voter_id;
        if (voterId && item.id) {
            sendCheckboxStateToAPI(voterId, item.id)
        }
    };


    const setTypeColor = (id) => {
        let selectedColor = 'black';

        switch (Number(id)) {
            case 1:
                selectedColor = '#188357';
                break;
            case 2:
                selectedColor = '#FF3030';
                break;
            case 3:
                selectedColor = '#FBBE17';
                break;
        }
        setColor(selectedColor);
    }


    const sendCheckboxStateToAPI = async (voterId, checkboxID) => {
        try {
            const response = await axios.put(`http://20.40.48.86:8001/api/favour/${voterId}/`, {
                voter_favour_id: checkboxID,
            });
            if (response.status !== 200) {
                throw new Error('Failed to update checkbox state.');
            }
        } catch (error) {
            console.error('Error updating checkbox state:', error.message);
            alert('Failed to update checkbox state. Please try again.');
        }
    };

    const fetchCasteData = async () => {
        try {
            const response = await axios.get('http://20.40.48.86:8001/api/cast/');
            const casteData = response.data.map(cast => ({
                label: `${cast.cast_id} - ${cast.cast_name}`,
                value: cast.cast_id,
            }));
            setCasteOptions(casteData);
        } catch (error) {
            console.error('Error fetching caste data:', error.toString ? error.toString() : 'Unknown error');
            Alert.alert('Error', 'Failed to load caste data');
        }
    };


    useEffect(() => {
        if (selectedVoter) {
            setName(selectedVoter.voter_name || '');
            setParentName(selectedVoter.voter_parent_name || '');
            setContact(selectedVoter.voter_contact_number?.toString() || '');
            setCaste(selectedVoter.voter_cast_id || null);
            setCurrentStatus(selectedVoter.voter_live_status_id || null);
            setMaritalStatus(selectedVoter.voter_marital_status_id || null);
            setGender(selectedVoter.voter_gender || null);
            setAge(selectedVoter.voter_age ? Number(selectedVoter.voter_age) : null);
            setVoterFavourType(selectedVoter.voter_favour_id || null);
            setTownName(selectedVoter.town_name || null)
            setBoothName(selectedVoter.booth_name || null)
            setVoterFavourType(selectedVoter.voter_favour_id)
            setTypeColor(selectedVoter.voter_favour_id)
        } else {
            setName('');
            setParentName('');
            setContact('');
            setCaste(null);
            setCurrentStatus(null);
            setMaritalStatus(null);
            setGender(null);
            setAge(null);
            setVoterFavourType(null);
        }

        fetchCasteData();
    }, [selectedVoter]);


    const handleCloseModal = () => {
        setModalVisible(false)
    }


    const handleCloseEditForm = () => {
        resetFields()
        onClose()
    }

    const handlePdfIconClick = async (voterId) => {
        try {
            const response = await axios.get(`http://20.40.48.86:8001/api/generate_voter_pdf/${voterId}`, {
                params: { voter_id: voterId },
                responseType: 'arraybuffer', // Request the response as an array buffer
            });

            // Convert array buffer to base64 string
            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            // Get the file URI to save the PDF
            const fileUri = FileSystem.documentDirectory + `voter_${voterId}.pdf`;

            // Write the PDF to the file system
            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            Alert.alert('Success', 'PDF has been saved to your device!');

            // Share or open the PDF file
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing not available on this device.');
            }

        } catch (error) {
            console.error('Error downloading PDF:', error.toString ? error.toString() : 'Unknown error');
            Alert.alert('Error', 'Failed to download the PDF.');
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const editedVoter = {
            "voter_id": selectedVoter.voter_id,
            "voter_name": name,
            "voter_favour_id": voterFavourType,
        }

        try {
            const apiUrl = `http://20.40.48.86:8001/api/voters/${selectedVoter.voter_id}/`;
            const response = await axios.patch(apiUrl, {
                voter_name: name,
                voter_parent_name: parentName,
                voter_contact_number: contact,
                voter_cast_id: caste,
                voter_age: age,
                voter_gender: gender,
                voter_live_status_id: currentStatus,
                voter_marital_status_id: maritalStatus,
                voter_favour_id: voterFavourType,
            });

            Alert.alert("Success", "Voter details updated successfully.");
        } catch (error) {
            Alert.error("Error", "Failed to update voter details.");
        } finally {
            setLoading(false);
            onEditVoter(editedVoter)
            handleCloseEditForm()
        }
    };

    const resetFields = () => {
        setName('');
        setParentName('');
        setContact('');
        setCaste(null);
        setCurrentStatus(null);
        setMaritalStatus(null);
        setGender(null);
        setVoterFavourType(null);
        setAge(null);
        setColor('black')
        // setUpdate(false)
    };

    useEffect(() => {
        // Reset thumb state whenever the modal opens
        if (isVisible) {
            setThumbSelected(false);
        }
    }, [isVisible]);

    const toggleThumb = () => {
        setThumbSelected(prev => !prev);
    }


    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <Pressable style={styles.modalBackground} onPress={onClose}>
                <Pressable style={styles.modalContainer} onPress={Keyboard.dismiss}>
                    <View style={styles.header}>
                        <Text style={{ fontSize: 22, color: 'black', fontWeight: 'bold' }}>Edit Voter Details</Text>
                        <View style={{
                            flexDirection: 'row',
                            columnGap: width * 0.05

                        }}>
                            <TouchableOpacity onPress={toggleThumb}>
                                <Ionicons
                                    name={isThumbSelected ? 'thumbs-up' : 'thumbs-up-outline'}
                                    size={28}
                                    color={isThumbSelected ? '#4CAF50' : '#9E9E9E'}  // 
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handlePdfIconClick(selectedVoter.voter_id)}>
                                <FontAwesome name="file-pdf-o" size={22} color="#db2b1f" style={styles.pdfIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setModalVisible(true) }}>
                                <Ionicons name="radio-button-on" size={24} color={color} />
                            </TouchableOpacity>
                        </View>
                    </View>


                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder='Enter name here...'
                        style={styles.input}
                    />
                    <TextInput
                        value={parentName}
                        onChangeText={setParentName}
                        placeholder='Enter parent name here...'
                        style={styles.input}
                    />
                    <TextInput
                        value={contact}
                        onChangeText={setContact}
                        placeholder='Enter contact no. here...'
                        keyboardType='phone-pad'
                        style={styles.input}
                    />

                    <DropDownPicker
                        open={openCaste}
                        value={caste}
                        items={casteOptions}
                        setOpen={setOpenCaste}
                        setValue={setCaste}
                        placeholder='Caste'
                        style={[styles.dropdown, { zIndex: 9999 }]}
                    />

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <DropDownPicker
                                open={openCurrentStatus}
                                value={currentStatus}
                                items={statusOptions}
                                setOpen={setOpenCurrentStatus}
                                setValue={setCurrentStatus}
                                placeholder='Current Status'
                                dropDownContainerStyle={{ zIndex: 999 }}
                                style={[styles.dropdown, { zIndex: 999 }]}
                            />
                            <TextInput
                                value={age ? age.toString() : ''}
                                onChangeText={(text) => setAge(text ? Number(text) : null)}
                                placeholder='Enter age here...'
                                keyboardType='numeric'
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.column}>
                            <DropDownPicker
                                open={openMaritalStatus}
                                value={maritalStatus}
                                items={maritalOptions}
                                setOpen={setOpenMaritalStatus}
                                setValue={setMaritalStatus}
                                placeholder='Marital Status'
                                dropDownContainerStyle={{ zIndex: 999 }}
                                style={[styles.dropdown, { zIndex: 999 }]}
                            />
                            <DropDownPicker
                                open={openGender}
                                value={gender}
                                items={genderOptions}
                                setOpen={setOpenGender}
                                setValue={setGender}
                                placeholder='Gender'
                                dropDownContainerStyle={{ zIndex: 99 }}
                                style={[styles.dropdown, { zIndex: 99 }]}
                            />
                        </View>
                    </View>


                    <View>
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Town Name :</Text>
                            <Text style={styles.value}>{townName}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Booth Name:</Text>
                            <Text style={styles.value}>{boothName}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Pressable onPress={handleCloseEditForm} style={styles.cancelButton}>
                            <Text style={{ color: '#E54394', textAlign: 'center', paddingVertical: 10, fontSize: 17, fontWeight: '600' }}>Cancel</Text>
                        </Pressable>
                        <Pressable onPress={handleSubmit} style={styles.submitButton}>
                            <Text style={{ color: 'white', textAlign: 'center', paddingVertical: 10, fontSize: 17, fontWeight: '600' }}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>

            <ColorLegendModal
                isVisible={modalVisible}
                closeModal={handleCloseModal}
                onSelect={handleSelectedVoterType}
            />
        </Modal>
    );
};



const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: width * 0.9,
        borderRadius: 10,
        padding: 20,
        paddingVertical: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    dropdown: {
        marginVertical: 10,
        width: "100%",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
    },
    column: {
        flex: 1,
    },
    cancelButton: {
        borderWidth: 1.5,
        borderColor: '#E54394',
        flex: 1,
        borderRadius: 5,
        marginRight: 10,
    },
    submitButton: {
        backgroundColor: '#E54394',
        flex: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        flexWrap: 'wrap'
    },
    label: {
        flex: 0.4,
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        flex: 0.6,
        fontSize: 16,
        textAlign: 'left',
    },
});
