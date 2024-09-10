import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

const TownVoters = ({ route }) => {
    const { townId } = route.params;
    const [voters, setVoters] = useState([]);

    const [filteredVoters, setFilteredVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchedValue, setSearchValue] = useState('');


    const serchedVoter = voters.filter(voter =>
        (voter.voter_name && voter.voter_name.toLowerCase().includes(searchedValue.toLowerCase())) ||
        (voter.voter_id && voter.voter_id.toString().includes(searchedValue))
    );

    useEffect(() => {
        setFilteredVoters(serchedVoter);
    }, [searchedValue, voters]);


    useEffect(() => {
        axios.get(`http://192.168.200.23:8000/api/town_wise_voter_list/${townId}/`)
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    setVoters(response.data);
                } else {
                    setError('Unexpected API response format.');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching voter data:', error);
                setError('Error fetching data. Please try again later.');
                setLoading(false);
            });
    }, [townId]);


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={'small'} />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <HeaderFooterLayout showHeader={false} showFooter={true}>

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

                <View style={styles.listContainer}>
                    {filteredVoters.length > 0 ? (
                        <FlatList
                            data={filteredVoters}
                            keyExtractor={item => item.voter_id.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Pressable style={styles.voterItem}>
                                    <View style={styles.voterDetails}>
                                        <View style={{
                                            borderRightWidth: 1, borderColor: '#D9D9D9',
                                            width: 60, alignItems: 'center',
                                        }}>
                                            <Text style={{}}>{item.voter_id}</Text>
                                        </View>
                                        <Text>{item.voter_name}</Text>
                                    </View>
                                </Pressable>
                            )}
                        />
                    ) : (
                        <Text style={styles.noDataText}>No results found</Text>
                    )}
                </View>
            </View>
        </HeaderFooterLayout>
    )
}

export default TownVoters

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        height: height * 0.85,
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
        flex: 0.95,
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'

    }
});