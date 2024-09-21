import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

const Towns = () => {
    const navigation = useNavigation();
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [towns, setTowns] = useState([]);

    const searchedTown = towns.filter(town =>
        (town.town_name && town.town_name.toString().includes(searchedValue)) ||
        (town.town_id && town.town_id.toString().includes(searchedValue))
    );


    const fetchData = async () => {
        try {
            const statesResponse = await axios.get('http://192.168.200.23:8000/api/towns/');
            const formattedTowns = statesResponse.data;
            if (Array.isArray(formattedTowns)) {
                setTowns(formattedTowns);
            } else {
                console.error('Expected an array of towns');
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
                            keyExtractor={item => item.town_id.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Pressable style={styles.voterItem}
                                    onPress={() => {
                                        navigation.navigate('Town Voters', { townId: item.town_id })
                                    }}>
                                    <View style={styles.voterDetails}>
                                        <Text style={{
                                            borderWidth: 1, borderColor: 'blue', width: 30,
                                            textAlign: 'center', borderRadius: 3, fontWeight: '700'
                                        }}>{item.town_id}</Text>
                                        <Text>{item.town_name}</Text>
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
    );
}

export default Towns;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        // height: height * 0.85,
        marginBottom: height * 0.25
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
        height: height * 0.75
    },
    voterItem: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 1,
        borderWidth: 0.1,
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
    }
});
