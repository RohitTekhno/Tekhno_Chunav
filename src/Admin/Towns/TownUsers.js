import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';

const { width, height } = Dimensions.get('screen');

const TownUsers = () => {
    const navigation = useNavigation();
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [townUsers, setTownUsers] = useState([]);

    const searchedTown = townUsers.filter(town =>
        (town.town_user_name && town.town_user_name.toString().includes(searchedValue)) ||
        (town.town_user_id && town.town_user_id.toString().includes(searchedValue))
    );


    const fetchData = async () => {
        try {
            const statesResponse = await axios.get('http://192.168.200.23:8000/api/town_user_info/');
            const formattedTowns = statesResponse.data;
            if (Array.isArray(formattedTowns)) {
                setTownUsers(formattedTowns);
            } else {
                console.error('Expected an array of townUsers');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);

    if (loading) {
        return (
            <HeaderFooterLayout showFooter={true}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={'small'} />
                    <Text>Loading...</Text>
                </View>
            </HeaderFooterLayout>
        );
    }

    return (
        <HeaderFooterLayout showFooter={true}>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="grey" />
                    <TextInput
                        value={searchedValue}
                        onChangeText={text => setSearchValue(text)}
                        placeholder='search by user’s name or ID'
                        style={styles.searchInput}
                    />
                </View>

                <View style={styles.listContainer}>
                    {searchedTown.length > 0 ? (
                        <FlatList
                            data={searchedTown}
                            keyExtractor={item => item.town_user_id.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Pressable style={styles.voterItem}>
                                    <View style={styles.voterDetails}>
                                        <View style={{
                                            borderWidth: 1, borderColor: 'blue', width: 30, padding: 5,
                                            textAlign: 'center', borderRadius: 3, fontWeight: '700',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{ fontWeight: '700', textAlignVertical: 'center' }}>{item.town_user_id}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'column', flex: 1 }}>
                                            <Text>{item.town_user_name}</Text>
                                            <Text style={{ color: '#565D6D', fontSize: 11 }}>Ph. No {item.town_user_contact_number}</Text>
                                        </View>
                                    </View>
                                    {/* <Pressable onPress={() => { navigation.navigate('Updated Voters') }}>
                                        <MaterialCommunityIcons name="arrow-right-bold-box" size={height * 0.04} color="#0077b6" />
                                    </Pressable> */}
                                </Pressable>
                            )}
                        />
                    ) : (
                        <Text style={styles.noDataText}>No results found</Text>
                    )}
                </View>
            </View>
        </HeaderFooterLayout>
    );
}

export default TownUsers;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        // height: height * 0.9,
        marginBottom: height * 0.25,
        backgroundColor: 'white',
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
        columnGap: 20,

    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },
    listContainer: {
        // flex: 1,
    },
    voterItem: {
        flex: 1,
        borderRadius: 2,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.2
    },
    voterDetails: {
        flex: 1,
        flexDirection: 'row',
        gap: 20,
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
    }
});
