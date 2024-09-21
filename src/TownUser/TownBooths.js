import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomTUserBottomTabs from '../Navigation/CustomBottonNav';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TownUserContext } from './ContextApi/TownUserProvider';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');
const TownBooths = () => {
    const navigation = useNavigation()
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [booths, setBooths] = useState([]);
    const { userId } = useContext(TownUserContext);
    const [error, setError] = useState(null);

    const searchedBooth = booths.filter(booth => {
        const boothId = booth.booth_id ? booth.booth_id.toString().toLowerCase() : '';
        const boothName = booth.booth_name ? booth.booth_name.toLowerCase() : '';
        const searchValueLower = searchedValue.toLowerCase();

        return boothId.includes(searchValueLower) || boothName.includes(searchValueLower);
    });


    const fetchData = async () => {
        try {
            const statesResponse = await axios.get(`http://192.168.200.23:8000/api/get_booth_names_by_town_user/${userId}`);
            const formattedTowns = statesResponse.data;

            if (Array.isArray(formattedTowns)) {
                setBooths(formattedTowns);
            } else {
                console.error('Expected an array of booths');
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

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleNotificationBtn = () => {
        Alert.alert("Notification Pressed...");
    };

    return (

        <CustomTUserBottomTabs showFooter={true}>
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

                {loading ?
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={'small'} color={'black'} />
                        <Text>Loading...</Text>
                    </View> :
                    <View style={styles.listContainer}>
                        {searchedBooth.length > 0 ? (
                            <FlatList
                                data={searchedBooth}
                                keyExtractor={item => item.booth_id.toString()}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <Pressable style={styles.voterItem}
                                        onPress={() => {
                                            navigation.navigate('Booth Voters', { boothId: item.booth_id })
                                        }}>
                                        <Text style={{
                                            borderWidth: 1, borderColor: 'blue', width: 30,
                                            textAlign: 'center', borderRadius: 3, fontWeight: '700'
                                        }}>{item.booth_id}</Text>
                                        <Text>{item.booth_name}</Text>
                                    </Pressable>
                                )}
                            />
                        ) : (
                            <Text style={styles.noDataText}>No results found</Text>
                        )}
                    </View>
                }
            </View>
        </CustomTUserBottomTabs>
    );
}

export default TownBooths;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        height: height * 0.8,
        backgroundColor: 'white'
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
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
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 1,
        borderWidth: 0.1,
        gap: 10,
        alignItems: 'center'
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
