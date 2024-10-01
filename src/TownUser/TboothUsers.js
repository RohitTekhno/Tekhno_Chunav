import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'

import CustomTUserBottomTabs from '../Navigation/CustomBottonNav';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TownUserContext } from './ContextApi/TownUserProvider';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import BuserDetailsPopUp from '../ReusableCompo/BuserDetailsPopUp';

const { width, height } = Dimensions.get('screen');
const TboothUsers = () => {
    const navigation = useNavigation()
    const { userId } = useContext(TownUserContext);
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [booths, setBooths] = useState([]);
    const [selectedBuser, setBuser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);


    const searchedBooth = booths.filter(user => {
        const boothId = user.user_id ? user.user_id.toString().toLowerCase() : '';
        const boothName = user.user_name ? user.user_name.toLowerCase() : '';
        const searchValueLower = searchedValue.toLowerCase();

        return boothId.includes(searchValueLower) || boothName.includes(searchValueLower);
    });


    const fetchData = async () => {
        try {
            const response = await axios.get(`http://192.168.200.23:8000/api/get_booth_users_by_town_user/${userId}/`);
            const formattedTowns = response.data;
            if (Array.isArray(formattedTowns)) {
                setBooths(formattedTowns);
            } else {
                console.error('Expected an array of booths');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching booth users:', error);
            setLoading(false);
        }
    };

    const fetchVoterDetails = (id) => {
        axios.get(`http://192.168.200.23:8000/api/booth_user_info/${id}`)
            .then(response => {
                setBuser(response.data);
                setIsModalVisible(true);
            })
            .catch(error => {
                console.error('Error fetching voter details:', error);
                Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
            });
    };



    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);



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
                    </View>
                    :
                    <View style={styles.listContainer}>
                        {searchedBooth.length > 0 ? (
                            <>
                                <FlatList
                                    data={searchedBooth}
                                    keyExtractor={item => item.user_id.toString()}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => (
                                        <Pressable style={styles.voterItem}
                                            onPress={() => { navigation.navigate("Approval Voters", { Buser_id: item.user_id }) }}>
                                            <Text style={{
                                                borderWidth: 1, borderColor: 'blue', width: 30,
                                                textAlign: 'center', borderRadius: 3, fontWeight: '700'
                                            }}>{index + 1}</Text>
                                            <Text>{item.user_name}</Text>
                                        </Pressable>
                                    )}
                                />
                                <BuserDetailsPopUp
                                    isModalVisible={isModalVisible}
                                    selectedBuser={selectedBuser}
                                    setIsModalVisible={setIsModalVisible}
                                />
                            </>
                        ) : (
                            <Text style={styles.noDataText}>No results found</Text>
                        )}
                    </View>
                }
            </View>
        </CustomTUserBottomTabs>
    )
}

export default TboothUsers


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        height: height * 0.86,
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
        height: height * 0.75
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
        // justifyContent: 'center',
        alignItems: 'center',
    }
});
