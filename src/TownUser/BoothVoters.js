import { Dimensions, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import VoterDetailsPopUp from '../ReusableCompo/VoterDetailsPopUp';
import CustomTUserBottomTabs from '../Navigation/CustomBottonNav';

const { width, height } = Dimensions.get('screen');

const BoothVoters = ({ route }) => {
    const { boothId } = route.params;
    const [voters, setVoters] = useState([]);

    const [filteredVoters, setFilteredVoters] = useState([]);
    const [searchedValue, setSearchValue] = useState('');

    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


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


    const serchedVoter = voters.filter(voter =>
        (voter.voter_name && voter.voter_name.toLowerCase().includes(searchedValue.toLowerCase())) ||
        (voter.voter_id && voter.voter_id.toString().includes(searchedValue))
    );

    useEffect(() => {
        setFilteredVoters(serchedVoter);
    }, [searchedValue, voters]);

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const getBoothVoters = async () => {
        setRefreshing(true)
        axios.get(`http://192.168.200.23:8000/api/get_voters_by_booth/${boothId}/`)
            .then(response => {
                if (response.data.voters && Array.isArray(response.data.voters)) {
                    setVoters(response.data.voters);
                } else {
                    setError('Unexpected API response format.');
                }
                setRefreshing(false);
            })
            .catch(error => {
                console.error('Error fetching voter data:', error);
                setError('Error fetching data. Please try again later.');
                BottomBoothsStack(false);
            });
    }

    useEffect(() => {
        getBoothVoters()
    }, [boothId]);

    const handleRefresh = () => {
        setRefreshing(true);
        getBoothVoters();
        setRefreshing(false);
    };


    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="grey" />
                <TextInput
                    value={searchedValue}
                    onChangeText={text => setSearchValue(text)}
                    placeholder='search by voter’s name or ID'
                    style={styles.searchInput}
                />
            </View>

            {refreshing ?
                (<View style={styles.loadingContainer}>
                    <ActivityIndicator size={'small'} color={'black'} />
                    <Text>Loading...</Text>
                </View>
                ) : (
                    < FlatList
                        data={filteredVoters}
                        keyExtractor={item => item.voter_id.toString()}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                            />
                        }
                        ListEmptyComponent={<Text style={styles.noDataText}>No results found</Text>}
                        renderItem={({ item }) => (
                            <Pressable style={styles.voterItem} onPress={() => { handleVoterPress(item.voter_id) }}>
                                <View style={styles.voterDetails}>
                                    <View style={{
                                        borderRightWidth: 1, borderColor: '#D9D9D9',
                                        width: 60, alignItems: 'center',
                                    }}>
                                        <Text style={{}}>{item.voter_id}</Text>
                                    </View>
                                    <Text style={{ flex: 1 }}>{toTitleCase(item.voter_name)}</Text>
                                </View>
                            </Pressable>
                        )}
                    />
                )
            }
            <VoterDetailsPopUp
                isModalVisible={isModalVisible}
                selectedVoter={selectedVoter}
                setIsModalVisible={setIsModalVisible}
            />
        </View >
    )
}

export default BoothVoters

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        height: height * 0.79,
        backgroundColor: 'white'
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
    listContainer: {
        flex: 1,
        backgroundColor: 'white'
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
    voterDetails: {
        flexDirection: 'row',
        gap: 10
    },
    noDataText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: 'gray',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
    }
});