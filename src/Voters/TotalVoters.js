import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Dimensions, TouchableOpacity, Modal, Alert } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import { ActivityIndicator } from 'react-native-paper';

const { width, height } = Dimensions.get('screen');

export default function Totalvoters({ navigation }) {
    const [voters, setVoters] = useState([]);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        axios.get('http://192.168.200.23:8000/api/total_voters/')
            .then(response => {
                setVoters(response.data);
                setFilteredVoters(response.data);
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching voters data:', error);
            });
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = voters.filter(voter =>
            voter.voter_id.toString().includes(text) || voter.voter_name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredVoters(filtered);
    };

    const fetchVoterDetails = (voter_id) => {
        axios.get(`http://192.168.200.23:8000/api/voters/${voter_id}`)
            .then(response => {
                setSelectedVoter(response.data);
                setIsModalVisible(true);
            })
            .catch(error => {
                console.error('Error fetching voter details:', error);
                Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
            });
    };

    const handleVoterPress = (voter_id) => {
        fetchVoterDetails(voter_id);
    };

    if (loading) {
        return (
            <HeaderFooterLayout showFooter={true}>
                < View style={styles.loadingContainer} >
                    <ActivityIndicator size={'small'} />
                    <Text>Loading...</Text>
                </View >
            </HeaderFooterLayout >
        );
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleVoterPress(item.voter_id)}>
            <View style={styles.itemContainer}>
                <View style={styles.voterRecord}>
                    <View style={styles.idSection}>
                        <Text style={styles.itemText}>{item.voter_id}</Text>
                    </View>
                    <View style={styles.nameSection}>
                        <Text style={styles.itemText}>{item.voter_name}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <HeaderFooterLayout showFooter={true}>
            <View style={styles.container}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search by ID or Name"
                    value={searchText}
                    onChangeText={handleSearch}
                />
                <FlatList
                    data={filteredVoters}
                    keyExtractor={item => item.voter_id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContent}
                />


                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            {selectedVoter && (
                                <>
                                    <Text style={styles.modalTitle}>Voter Details</Text>
                                    <Text style={styles.modalText}>Name: {selectedVoter.voter_name}</Text>
                                    <Text style={styles.modalText}>Age: {selectedVoter.voter_age}</Text>
                                    <Text style={styles.modalText}>Gender: {selectedVoter.voter_gender}</Text>
                                    <Text style={styles.modalText}>Town: {selectedVoter.town_name}</Text>
                                    <Text style={styles.modalText}>Booth: {selectedVoter.booth_name}</Text>
                                    <Text style={styles.modalText}>Contact: {selectedVoter.voter_contact_number}</Text>
                                    <Text style={styles.modalText}>Caste: {selectedVoter.voter_cast}</Text>
                                    <Text style={styles.modalText}>Live Status: {selectedVoter.live_status_type}</Text>
                                    <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        </HeaderFooterLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        paddingVertical: 20,
        height: height * 0.831,
        backgroundColor: 'white'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        width: "100%",
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        alignSelf: 'center',
    },
    itemContainer: {
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    voterRecord: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    idSection: {
        width: '10%',
        borderRightWidth: 1,
        borderRightColor: 'black',
        paddingRight: 10,
        alignItems: 'center'
    },
    nameSection: {
        flex: 1,
        paddingLeft: 10,
    },
    itemText: {
        fontSize: height * 0.018,
        // fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        height: '60%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
    },
    flatListContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});
