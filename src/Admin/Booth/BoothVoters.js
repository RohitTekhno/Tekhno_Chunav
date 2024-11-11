import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import VoterDetailsPopUp from '../Voters/VoterDetailsPopUp';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';


const BoothVoters = ({ route }) => {
    const { boothId } = route.params;
    const [voters, setVoters] = useState([]);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchedValue, setSearchValue] = useState('');
    const [sortState, setSortState] = useState(0);
    const [initialVoters, setInitialVoters] = useState([]);

    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [selectedVoters, setSelectedVoters] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const fetchVoterDetails = (voter_id) => {
        axios.get(`http://192.168.1.8:8000/api/voters/${voter_id}`)
            .then(response => {
                setSelectedVoter(response.data);
                setIsModalVisible(true);
            })
            .catch(error => {
                Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
            });
    };

    const handleVoterPress = (voter_id) => {
        if (isSelectionMode) {
            toggleVoterSelection(voter_id);
        } else {
            fetchVoterDetails(voter_id);
        }
    };

    const toggleVoterSelection = (voter_id) => {
        if (selectedVoters.includes(voter_id)) {
            setSelectedVoters(selectedVoters.filter(id => id !== voter_id));
        } else {
            setSelectedVoters([...selectedVoters, voter_id]);
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

    const searchedVoters = voters.filter(voter =>
        (voter.voter_name && voter.voter_name.toLowerCase().includes(searchedValue.toLowerCase())) ||
        (voter.voter_id && voter.voter_id.toString().includes(searchedValue))
    );

    useEffect(() => {
        setFilteredVoters(searchedVoters);
    }, [searchedValue, voters]);

    const sortVotersAlphabetically = () => {
        if (sortState === 0) {

            const sortedVoters = [...filteredVoters].sort((a, b) => {
                const nameA = a.voter_name ? a.voter_name.toLowerCase() : '';
                const nameB = b.voter_name ? b.voter_name.toLowerCase() : '';
                return nameA.localeCompare(nameB);
            });
            setFilteredVoters(sortedVoters);
            setSortState(1);
        } else if (sortState === 1) {
            // Sort Z-A
            const sortedVoters = [...filteredVoters].sort((a, b) => {
                const nameA = a.voter_name ? a.voter_name.toLowerCase() : '';
                const nameB = b.voter_name ? b.voter_name.toLowerCase() : '';
                return nameB.localeCompare(nameA);
            });
            setFilteredVoters(sortedVoters);
            setSortState(2);
        } else {
            // Reset to default order (initial voters)
            setFilteredVoters(initialVoters);
            setSortState(0);
        }
    };

    useEffect(() => {
        axios.get(`http://192.168.1.8:8000/api/get_voters_by_booth/${boothId}/`)
            .then(response => {
                if (response.data.voters && Array.isArray(response.data.voters)) {
                    setVoters(response.data.voters);
                    setFilteredVoters(response.data.voters);
                    setInitialVoters(response.data.voters);
                } else {
                    setError('Unexpected API response format.');
                }
                setLoading(false);
            })
            .catch(error => {
                Alert.alert('Error fetching voter data', error.toString ? error.toString() : 'Unknown error');

                setError('Error fetching data. Please try again later.');
                setLoading(false);
            });
    }, [boothId]);

    const getIconName = () => {
        if (sortState === 0) {
            return "sort";
        } else if (sortState === 1) {
            return "sort-alpha-down";
        } else if (sortState === 2) {
            return "sort-alpha-up-alt";
        }
    };

    const send_WhatsApp_Message = async () => {
        try {
            const response = await axios.post(`http://192.168.1.8:8000/api/send_whatsapp_message/`, {
                "voter_ids": selectedVoters
            });

            if (response.status === 200) {
                alert("WhatsApp message sent successfully!");
                exitSelectionMode();
            }
        } catch (error) {
            Alert.alert("Error sending WhatsApp message:", error.toString ? error.toString() : 'Unknown error');
        }
    };

    const send_Text_Message = async () => {
        try {
            const response = await axios.post(`http://192.168.1.8:8000/api/send_text_message/`, {
                "voter_ids": selectedVoters
            });

            if (response.status === 200) {
                alert("Text message sent successfully!");
                exitSelectionMode();
            }
        } catch (error) {
            Alert.alert("Error sending text message:", error.toString ? error.toString() : 'Unknown error');
        }
    };

    const selectAllVoters = () => {
        setSelectedVoters(filteredVoters.map(item => item.voter_id));
    };

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <HeaderFooterLayout
            headerText={`Voters in Booth : ${route.params.boothId}  `}
            showHeader={true}
            showFooter={false}
            leftIcon={true}
            rightIcon={true}
            leftIconName="keyboard-backspace"
            rightIconName={getIconName()}
            onRightIconPress={sortVotersAlphabetically}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="grey" />
                    <TextInput
                        value={searchedValue}
                        onChangeText={text => setSearchValue(text)}
                        placeholder='Search by voter’s name or ID'
                        style={styles.searchInput}
                    />
                </View>

                {isSelectionMode && (
                    <View style={styles.selectionToolbar}>
                        <Ionicons name="logo-whatsapp" size={30} color="green" style={styles.actionIcon} onPress={send_WhatsApp_Message} />
                        <Ionicons name="chatbubble-outline" size={30} color="blue" style={styles.actionIcon} onPress={send_Text_Message} />
                        <Ionicons name="close-circle" size={30} color="red" onPress={exitSelectionMode} style={styles.actionIcon} />
                    </View>
                )}

                {(loading) ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={'large'} color={'black'} />
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    < View style={styles.listContainer}>
                        <FlatList
                            data={filteredVoters}
                            keyExtractor={item => item.voter_id.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[styles.voterItem, selectedVoters.includes(item.voter_id) && styles.selectedVoterItem]}
                                    onPress={() => handleVoterPress(item.voter_id)}
                                    onLongPress={() => handleLongPress(item.voter_id)}
                                >
                                    <View style={styles.voterDetails}>
                                        <View style={{
                                            borderRightWidth: 1, borderColor: '#D9D9D9',
                                            width: 60, alignItems: 'center',
                                        }}>
                                            <Text>{item.voter_id}</Text>
                                        </View>
                                        <Text style={{ flex: 1 }}>{toTitleCase(item.voter_name)}</Text>
                                    </View>
                                    {isSelectionMode && (
                                        <Checkbox
                                            status={selectedVoters.includes(item.voter_id) ? 'checked' : 'unchecked'}
                                            onPress={() => toggleVoterSelection(item.voter_id)}
                                        />
                                    )}
                                </Pressable>
                            )}
                            ListEmptyComponent={() => (
                                <Text style={styles.noDataText}>No results found</Text>
                            )}
                        />

                        <VoterDetailsPopUp
                            isModalVisible={isModalVisible}
                            selectedVoter={selectedVoter}
                            setIsModalVisible={setIsModalVisible}
                        />
                    </View>)
                }
            </View>
        </HeaderFooterLayout >
    );
};

export default BoothVoters;

const styles = StyleSheet.create({
    container: {
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
        columnGap: 20,
        marginVertical: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
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
        flex: 1,
        borderRadius: 2,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.2,
    },
    selectedVoterItem: {
        backgroundColor: '#e0f7fa',
    },
    voterDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
