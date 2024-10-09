import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert, Modal } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { Checkbox } from 'react-native-paper';
import { BoothUserContext } from './ContextApi/BuserContext';
import HeaderFooterLayout from './HeaderFooterLayout';


const { width, height } = Dimensions.get('screen');

export default function Family({ navigation }) {
    const [voters, setVoters] = useState([]);
    const [searchedValue, setSearchValue] = useState('');
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFamilyModalVisible, setIsFamilyModalVisible] = useState(false);
    const [selectedVoters, setSelectedVoters] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const { buserId } = useContext(BoothUserContext);

    const [singleVoterId, setSingleVoterId] = useState(null);

    useEffect(() => {
        const fetchVoters = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://192.168.200.23:8000/api/get_voters_by_user_wise/${buserId}/`);
                if (Array.isArray(response.data.voters)) {
                    setVoters(response.data.voters);
                } else {
                    setVoters([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching voters:', error);
                setLoading(false);
                Alert.alert('Error', 'Failed to fetch voter data');
            }
        };

        fetchVoters();
    }, [buserId]);

    const toggleVoterSelection = (voter_id) => {
        if (selectedVoters.includes(voter_id)) {
            setSelectedVoters(selectedVoters.filter(id => id !== voter_id));
        } else {
            setSelectedVoters([...selectedVoters, voter_id]);
        }
    };

    const handleVoterPress = (voter_id) => {
        if (isSelectionMode) {
            toggleVoterSelection(voter_id);
        } else {
            setSelectedVoter(voters.find(voter => voter.voter_id === voter_id));
            setIsModalVisible(true);
        }
    };

    const handleLongPress = (voter_id) => {
        setIsSelectionMode(true);
        toggleVoterSelection(voter_id);
    };

    const exitSelectionMode = () => {
        setIsSelectionMode(false);
        setSelectedVoters([]);
    };

    const openFamilyModal = () => {
        if (selectedVoters.length === 0) {
            Alert.alert('No Voters Selected', 'Please select some voters first.');
            return;
        }
        setIsFamilyModalVisible(true);
    };

    const handleSave = async () => {
        if (!singleVoterId) {
            Alert.alert('No Voter Selected', 'Please select a voter from the modal.');
            return;
        }

        const payload = {
            voter_ids: selectedVoters,
            single_voter_id: singleVoterId,
            login_user_id: buserId,
        };

        try {
            const response = await axios.post(
                'http://192.168.200.23:8000/api/create_family_group_by_booth_user/',
                payload
            );
            console.log('Response:', response.data);
            Alert.alert('Success', 'Family group saved successfully.');


            setIsFamilyModalVisible(false);
            setSelectedVoters([]);
            setSingleVoterId(null);
            setSearchValue('');
            setIsSelectionMode(false);
        } catch (error) {
            console.error('Error saving family group:', error);
            Alert.alert('Error', 'Failed to save family group.');
        }
    };


    const searchedVoters = voters.filter(voter =>
        (voter.voter_name && voter.voter_name.toLowerCase().includes(searchedValue.toLowerCase())) ||
        (voter.voter_id && voter.voter_id.toString().includes(searchedValue))
    );

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <HeaderFooterLayout
            headerText='Create Family'
            showFooter={false}
            leftIcon={<MaterialIcons name="chevron-left" size={24} color="black" onPress={handleGoBack} />}
            rightIcon={<Ionicons name="close-circle" size={26} color="black" onPress={exitSelectionMode} />}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="grey" />
                    <TextInput
                        value={searchedValue}
                        onChangeText={text => setSearchValue(text)}
                        placeholder="Search by voter’s name or ID"
                        style={styles.searchInput}
                    />
                </View>



                {isSelectionMode && (
                    <View style={styles.selectionToolbar}>
                        <Ionicons name="close-circle" size={30} color="red" onPress={exitSelectionMode} style={styles.actionIcon} />
                    </View>
                )}

                <View style={styles.listContainer}>
                    {loading ? (
                        <Text style={styles.loadingText}>Loading...</Text>
                    ) : searchedVoters.length > 0 ? (
                        <FlatList
                            data={searchedVoters}
                            keyExtractor={item => item.voter_id.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.voterItem,
                                        selectedVoters.includes(item.voter_id) && styles.selectedVoterItem
                                    ]}
                                    onPress={() => handleVoterPress(item.voter_id)}
                                    onLongPress={() => handleLongPress(item.voter_id)}
                                >
                                    <View style={styles.voterDetails}>
                                        <View style={styles.voterIdContainer}>
                                            <Text>{item.voter_id}</Text>
                                        </View>
                                        <Text>{item.voter_name}</Text>
                                    </View>


                                    <Checkbox
                                        status={selectedVoters.includes(item.voter_id) ? 'checked' : 'unchecked'}
                                        onPress={() => toggleVoterSelection(item.voter_id)}
                                        style={styles.checkbox}
                                    />
                                </Pressable>
                            )}
                        />
                    ) : (
                        <Text style={styles.noDataText}>No results found</Text>
                    )}

                    <View style={styles.buttoncontainer}>
                        <Pressable style={styles.bigButton} onPress={openFamilyModal}>
                            <Text style={styles.bigButtonText}>Create Group</Text>
                        </Pressable>
                        <Pressable style={styles.newButton} onPress={() => navigation.navigate('Familylist')}>
                            <Text style={styles.bigButtonText}>Families</Text>
                        </Pressable>
                    </View>
                </View>


                <Modal visible={isFamilyModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select a voter from the list</Text>
                            <FlatList
                                data={selectedVoters.map(voter_id => voters.find(voter => voter.voter_id === voter_id))}
                                keyExtractor={item => item.voter_id.toString()}
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={styles.modalVoterItem}
                                        onPress={() => setSingleVoterId(item.voter_id)}
                                    >
                                        <Text>{item.voter_name}</Text>
                                        <Checkbox
                                            status={singleVoterId === item.voter_id ? 'checked' : 'unchecked'}
                                            onPress={() => setSingleVoterId(item.voter_id)}
                                        />
                                    </Pressable>
                                )}
                            />

                            <Pressable style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </Pressable>
                            <Pressable style={styles.closeButton} onPress={() => setIsFamilyModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </HeaderFooterLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        height: '100%',
    },
    searchContainer: {
        borderColor: '#9095A1',
        borderWidth: 1.5,
        borderRadius: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },
    selectionToolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 10,
        backgroundColor: '#f2f2f2',
        marginHorizontal: 10,
    },
    buttoncontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        marginBottom: '2%'
    },
    bigButton: {
        width: '70%',
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    bigButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    newButton: {
        width: '20%',
        backgroundColor: '#28a745',
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    newButtonIcon: {
        color: '#FFF',
    },
    selectionToolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    actionIcon: {
        paddingHorizontal: 15,
    },
    listContainer: {
        flex: 1,
    },
    voterItem: {
        borderRadius: 2,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.2,
        minHeight: 60, // Set a minimum fixed height
    },
    selectedVoterItem: {
        backgroundColor: '#e0f7fa',
    },
    voterDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    voterIdContainer: {
        marginRight: 10,
    },
    checkbox: {
        width: 30, // Ensure the checkbox has a fixed width
        height: 30, // Ensure the checkbox has a fixed height
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'gray',
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: width * 0.8,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalVoterItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: 'gray',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    closeButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});
