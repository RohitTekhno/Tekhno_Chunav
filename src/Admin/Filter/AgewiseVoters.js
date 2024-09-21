import { Alert, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { ActivityIndicator } from 'react-native-paper';
import VoterDetailsPopUp from '../../ReusableCompo/VoterDetailsPopUp';

const { width, height } = Dimensions.get('window');

const AgewiseVoters = () => {
    const [openAge, setOpenAge] = useState(false);
    const [ageValue, setAgeValue] = useState(null);
    const [ageItems, setAgeItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

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

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    useEffect(() => {
        setupAgeRanges();
    }, []);

    useEffect(() => {
        if (ageValue) {
            fetchVoters(ageValue);
        }
    }, [ageValue]);

    const setupAgeRanges = () => {
        const ranges = [
            { label: '18-30 YRS', value: '18,30' },
            { label: '31-50 YRS', value: '31,50' },
            { label: '51-100 YRS', value: '51,100' },
        ];
        setAgeItems(ranges);
    };

    const fetchVoters = async (ageValue) => {
        try {
            setLoading(true);
            const [minAge, maxAge] = ageValue.split(',').map(Number);
            const response = await axios.get(`http://192.168.200.23:8000/api/age_wise_voter/${minAge}/${maxAge}/`);
            setFilteredVoters(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching voters:', error);
            Alert.alert('Error', 'Failed to fetch voters. Please try again.');
            setLoading(false);
        }
    };

    return (
        <HeaderFooterLayout showFooter={true}>
            <View style={styles.container}>
                <DropDownPicker
                    open={openAge}
                    value={ageValue}
                    items={ageItems}
                    setOpen={setOpenAge}
                    setValue={setAgeValue}
                    setItems={setAgeItems}
                    placeholder='Select Age Range'
                    searchable={true}
                    searchPlaceholder="Search age range..."
                    placeholderStyle={styles.placeholder}
                    style={styles.dropdown}
                    searchTextInputStyle={styles.searchTextInput}
                    containerStyle={styles.dropdownContainer}
                    dropDownContainerStyle={[styles.dropdownMenu, { zIndex: 999 }]}
                    maxHeight={200}
                />

                {loading && ageValue ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size='small' />
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        <FlatList
                            data={filteredVoters}
                            keyExtractor={item => item.voter_id.toString()}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={!openAge}
                            renderItem={({ item }) => (
                                <Pressable style={styles.voterItem} onPress={() => { handleVoterPress(item.voter_id) }}>
                                    <View style={styles.voterDetails}>
                                        <View style={styles.voterIdContainer}>
                                            <Text>{item.voter_id}</Text>
                                        </View>
                                        <Text>{toTitleCase(item.voter_name)}</Text>
                                    </View>
                                </Pressable>
                            )}
                        />

                        <VoterDetailsPopUp
                            isModalVisible={isModalVisible}
                            selectedVoter={selectedVoter}
                            setIsModalVisible={setIsModalVisible}
                        />

                        {filteredVoters.length === 0 && !loading && (
                            <Text style={styles.noDataText}>No results found</Text>
                        )}
                    </View>
                )}
            </View>
        </HeaderFooterLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15,
        marginBottom: height * 0.1
    },
    dropdown: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: '#9095A1',
        marginVertical: 10,
    },
    dropdownContainer: {
        width: '100%',
    },
    dropdownMenu: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: '#9095A1',
    },
    searchTextInput: {
        borderColor: '#9095A1',
        borderRadius: 4,
    },
    placeholder: {
        color: '#9095A1',
        marginLeft: 15,
    },
    listContainer: {
        flex: 1,
    },
    voterItem: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.5,
        borderColor: '#9095A1',
        backgroundColor: 'white',
    },
    voterDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    voterIdContainer: {
        borderRightWidth: 1,
        borderColor: '#D9D9D9',
        paddingRight: 10,
        marginRight: 10,
        width: 60,
        alignItems: 'center',
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
        backgroundColor: 'white',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#9095A1',
    },
});

export default AgewiseVoters;
