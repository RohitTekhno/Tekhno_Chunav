import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ActivityIndicator } from 'react-native';
import { RefreshControl } from 'react-native';

const { width, height } = Dimensions.get('screen');

const BoothUsers = () => {
    const navigation = useNavigation();
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [boothUsers, setBoothUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false)

    const searchedTown = boothUsers.filter(town =>
        (town.user_name && town.user_name.toString().toLowerCase().includes(searchedValue.toLowerCase())) ||
        (town.user_phone && town.user_phone.toString().includes(searchedValue)) ||
        (town.user_id && town.user_id.toString().includes(searchedValue))
    );

    const fetchData = async () => {
        try {
            const statesResponse = await axios.get('http://192.168.1.31:8000/api/booth_user_info/');
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



    const deleteUser = async (userId) => {
        try {
            const response = await axios.post('http://192.168.1.31:8000/api/delete_user/', {
                user_id: userId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200 || response.status === 204) {
                await fetchData();
                Alert.alert('Success', 'User has been deleted successfully.');
            } else {
                Alert.alert('Error', 'Failed to delete the user.');
            }
        } catch (error) {
            Alert.alert('Error deleting user:', error);
            if (error.response) {
                Alert.alert('Error', `Failed to delete the user: ${error.response.data.message || 'Unexpected error'}`);
            } else if (error.request) {
                Alert.alert('Error', 'No response received. Check your network connection.');
            } else {
                Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
            }
        }
    };

    const handleLongPressDelete = (userId) => {
        Alert.alert(
            'Delete User',
            'Are you sure you want to delete this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteUser(userId),
                },
            ],
            { cancelable: true }
        );
    };

    const handlePDFClick = async () => {
        setPdfLoading(true);
        try {
            const response = await axios.get('http://192.168.1.31:8000/api/generate_booth_user_pdf/', {
                responseType: 'arraybuffer',
            });

            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const fileUri = FileSystem.documentDirectory + 'booth_users_report.pdf';
            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            //Alert.alert('Success', 'PDF has been saved to your device!');

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing not available on this device.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to download the PDF.');
        } finally {
            setPdfLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    }

    return (
        <HeaderFooterLayout
            headerText="Booth Users"
            showFooter={false}
            leftIcon={true}
            rightIcon={true}
            leftIconName="keyboard-backspace"
            rightIconName="file-pdf"
            onRightIconPress={handlePDFClick}
        >
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

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={'small'} color={"black"} />
                        <Text style={{ color: 'black' }}>Loading...</Text>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                />}
                            data={searchedTown}
                            keyExtractor={item => item.user_id.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.voterItem}
                                    onLongPress={() => handleLongPressDelete(item.user_id)}
                                >
                                    <View style={styles.voterDetails}>
                                        <Text style={{
                                            borderWidth: 1, borderColor: 'blue', width: 30,
                                            textAlign: 'center', borderRadius: 3, fontWeight: '700'
                                        }}>{item.user_id}</Text>
                                        <View style={{ flexDirection: 'column', flex: 1 }}>
                                            <Text>{toTitleCase(item.user_name)}</Text>
                                            <Text style={{ color: '#565D6D', fontSize: 11 }}>Ph. No:{item.user_phone}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'column', flex: 1 }}>
                                            <Text style={{ color: '#565D6D', fontSize: 11 }}>Booth : {(item.booth_names)}</Text>
                                        </View>
                                    </View>
                                    <Pressable onPress={() => { navigation.navigate('Updated Voters', { userId: item.user_id }) }}>
                                        <MaterialCommunityIcons name="arrow-right-bold-box" size={height * 0.04} color="#0077b6" />
                                    </Pressable>
                                </Pressable>
                            )}
                            ListEmptyComponent={<Text style={styles.noDataText}>No results found</Text>}
                        />
                    </View>
                )}
            </View>
        </HeaderFooterLayout>
    );
};

export default BoothUsers;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
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
    listContainer: {},
    voterItem: {
        flex: 1,
        borderRadius: 2,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.2,
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
        marginTop: 20,
        alignItems: 'center',
    },
});
