import { Alert, Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const BoothUser_ActivityLog = (routes) => {
    const { userId } = routes.route.params;
    const navigation = useNavigation();
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [boothUsers, setBoothUsers] = useState([]);

    const searchedTown = boothUsers.filter(town =>
        (town.voter_name && town.voter_name.toString().includes(searchedValue)) ||
        (town.voter_id && town.voter_id.toString().includes(searchedValue))
    );

    const fetchData = async () => {
        try {
            const statesResponse = await axios.get(`http://192.168.1.31:8000/api/edited_voters/${userId}/`);
            const formattedTowns = statesResponse.data;
            if (Array.isArray(formattedTowns)) {
                setBoothUsers(formattedTowns);
            } else {
                Alert.alert('Expected an array of boothUsers');
            }
            setLoading(false);
        } catch (error) {
            Alert.alert('Error fetching data:', error);
            setLoading(false);
        }
    };

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [userId]);

    const renderVoterField = (label, value) => {
        if (value) {
            return (
                <Text style={styles.voterField}>
                    {label}: {value}
                </Text>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="grey" />
                <TextInput
                    value={searchedValue}
                    onChangeText={text => setSearchValue(text)}
                    placeholder="Search by user’s name or ID"
                    style={styles.searchInput}
                />
            </View>

            <View style={styles.listContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={'large'} color={'black'} />
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={searchedTown}
                        keyExtractor={item => item.voter_id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <Pressable style={styles.voterItem}>
                                <View style={styles.voterDetails}>
                                    <Text style={{
                                        borderWidth: 1, borderColor: '#3C4CAC', padding: 5,
                                        textAlign: 'center', borderRadius: 2, fontWeight: '700'
                                    }}>{index + 1}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: '#9095A1', fontWeight: '600' }}>ID: {item.voter_id}</Text>
                                    <Text style={{ color: '#3C4CAC', fontWeight: '600' }}>Name: {toTitleCase(item.voter_name)}</Text>
                                    {renderVoterField('Parent Name', item.voter_parent_name)}
                                    {renderVoterField('Age', item.voter_age)}
                                    {renderVoterField('Gender', item.voter_gender)}
                                    {renderVoterField('Contact', item.voter_contact_number)}
                                    {renderVoterField('Caste', item.cast_name)}
                                    {renderVoterField('Updated Date', item.voter_updated_date)}
                                </View>
                            </Pressable>
                        )}
                        ListEmptyComponent={() => (
                            <Text style={styles.noDataText}>No results found</Text>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

export default BoothUser_ActivityLog;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: 'white',
    },
    searchContainer: {
        borderColor: '#9095A1',
        borderWidth: 1,
        borderRadius: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 10,
        columnGap: 20,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },
    listContainer: {
        flex: 1,
    },
    voterItem: {
        flex: 1,
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        gap: 20,
        borderWidth: 1,
        borderColor: '#D9D9D9'
    },
    voterDetails: {},
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
    }
});
