import { ActivityIndicator, Dimensions, FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TownUserContext } from './ContextApi/TownUserProvider';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

const TownBooths = () => {
    const navigation = useNavigation();
    const [searchedValue, setSearchValue] = useState('');
    const [booths, setBooths] = useState([]);
    const { userId } = useContext(TownUserContext);
    const [refreshing, setRefreshing] = useState(false);

    const searchedBooth = booths.filter(booth => {
        const boothId = booth.booth_id ? booth.booth_id.toString().toLowerCase() : '';
        const boothName = booth.booth_name ? booth.booth_name.toLowerCase() : '';
        const searchValueLower = searchedValue.toLowerCase();
        return boothId.includes(searchValueLower) || boothName.includes(searchValueLower);
    });

    const fetchData = async () => {
        setRefreshing(true);
        try {
            const response = await axios.get(`http://192.168.200.23:8000/api/get_booth_names_by_town_user/${userId}`);
            const formattedTowns = response.data;
            if (Array.isArray(formattedTowns)) {
                setBooths(formattedTowns);
            } else {
                console.error('Expected an array of booths');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    };

    const renderItem = ({ item }) => (
        <Pressable style={styles.voterItem}
            onPress={() => {
                navigation.navigate('Booth Voters', { boothId: item.booth_id });
            }}>
            <Text style={styles.boothId}>{item.booth_id}</Text>
            <Text style={styles.boothName}>{item.booth_name}</Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="grey" />
                <TextInput
                    value={searchedValue}
                    onChangeText={text => setSearchValue(text)}
                    placeholder='Search by user’s name or ID'
                    style={styles.searchInput}
                />
            </View>

            {refreshing ?
                (<View style={styles.loadingContainer}>
                    <ActivityIndicator size={'small'} color={'black'} />
                    <Text>Loading...</Text>
                </View>
                ) : (
                    <FlatList
                        data={searchedBooth}
                        keyExtractor={item => item.booth_id.toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                        }
                        renderItem={renderItem}
                        ListEmptyComponent={<Text style={styles.noDataText}>No results found</Text>}
                        showsVerticalScrollIndicator={false}
                        style={styles.listContainer}
                    />
                )
            }
        </View>
    );
};

export default TownBooths;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        height: height * 0.79,
        backgroundColor: 'white'
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
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },
    listContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    voterItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 1,
        borderWidth: 0.1,
        gap: 10,
    },
    boothId: {
        borderWidth: 1,
        borderColor: 'blue',
        width: 30,
        textAlign: 'center',
        borderRadius: 3,
        fontWeight: '700',
    },
    boothName: {
        flex: 11,
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
    },
});
