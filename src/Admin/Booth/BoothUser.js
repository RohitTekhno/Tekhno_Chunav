import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

const BoothUsers = () => {
    const navigation = useNavigation();
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [boothUsers, setBoothUsers] = useState([]);

    const searchedTown = boothUsers.filter(town =>
        (town.user_name && town.user_name.toString().includes(searchedValue)) ||
        (town.user_id && town.user_id.toString().includes(searchedValue))
    );


    const fetchData = async () => {
        try {
            const statesResponse = await axios.get('http://192.168.200.23:8000/api/register_user/');
            const formattedTowns = statesResponse.data;
            if (Array.isArray(formattedTowns)) {
                setBoothUsers(formattedTowns);
            } else {
                console.error('Expected an array of boothUsers');
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
            // <HeaderFooterLayout showFooter={true}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={'small'} />
                    <Text>Loading...</Text>
                </View>
            //  </HeaderFooterLayout> 
        );
    }

    return (
        <HeaderFooterLayout
            headerText="Booth Users"
            showFooter={false}
            leftIcon={true}
            rightIcon={true}
            leftIconName="chevron-left"
            rightIconName=""
            
        >
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
                            keyExtractor={item => item.user_id.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Pressable style={styles.voterItem}
                                // onPress={() => { navigation.navigate('Updated Voters') }}
                                >
                                    <View style={styles.voterDetails}>
                                        <Text style={{
                                            borderWidth: 1, borderColor: 'blue', width: 30,
                                            textAlign: 'center', borderRadius: 3, fontWeight: '700'
                                        }}>{item.user_id}</Text>
                                        <View style={{ flexDirection: 'column', flex: 1 }}>
                                            <Text style={{}}>{item.user_name}</Text>
                                            <Text style={{ color: '#565D6D', fontSize: 11 }}>Ph. No {item.user_phone}</Text>
                                        </View>
                                    </View>
                                    <Pressable onPress={() => { navigation.navigate('Updated Voters', { userId: item.user_id }) }}>
                                        <MaterialCommunityIcons name="arrow-right-bold-box" size={height * 0.04} color="#0077b6" />
                                    </Pressable>
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

export default BoothUsers;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        // height: height * 0.81,
        // marginBottom: height * 0.25,
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
        alignItems: 'center',
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
