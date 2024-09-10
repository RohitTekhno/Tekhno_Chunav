import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { ActivityIndicator } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const AgewiseVoters = () => {
    const [openTown, setOpenTown] = useState(false);
    const [townValue, setTownValue] = useState(null);
    const [townItems, setTownItems] = useState([]);

    const [openAge, setOpenAge] = useState(false);
    const [ageValue, setAgeValue] = useState(null);
    const [ageItems, setAgeItems] = useState([]);
    const [voters, setVoters] = useState([]);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTowns();
        setupAgeRanges();
    }, []);

    useEffect(() => {
        if (townValue && ageValue) {
            const [minAge, maxAge] = ageValue.split('-').map(Number);
            fetchVoters(townValue, minAge, maxAge);
        }
    }, [townValue, ageValue]);

    const getTowns = async () => {
        try {
            const response = await axios.get('http://192.168.200.23:8000/api/towns/');
            const formattedTownItems = response.data.map(town => ({
                label: `${town.town_id} - ${town.town_name}`,
                value: town.town_id
            }));
            setTownItems(formattedTownItems);
        } catch (error) {
            console.error('Error fetching town data:', error);
        }
    };

    const setupAgeRanges = () => {
        const ranges = [
            { label: '18-30 YRS', value: '18-30' },
            { label: '31-50 YRS', value: '31-50' },
            { label: '51-100 YRS', value: '51-100' },
        ];
        setAgeItems(ranges);
    };

    const fetchVoters = async (townId, minAge, maxAge) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://192.168.200.23:8000/api/town_wise_voter_list/${townId}/`);
            const filtered = response.data.filter(voter => {
                return voter.voter_age >= minAge && voter.voter_age <= maxAge;
            });
            setFilteredVoters(filtered);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching voters:', error);
        }
    };

    const isDropdownOpen = openTown || openAge;

    return (
        <HeaderFooterLayout showFooter={true}>
            <View style={styles.container}>
                <DropDownPicker
                    open={openTown}
                    value={townValue}
                    items={townItems}
                    setOpen={setOpenTown}
                    setValue={setTownValue}
                    setItems={setTownItems}
                    placeholder="Select Town"
                    searchable={true}
                    searchPlaceholder="Search town..."
                    placeholderStyle={styles.placeholder}
                    style={styles.dropdown}
                    searchTextInputStyle={styles.searchTextInput}
                    containerStyle={styles.dropdownContainer}
                    dropDownContainerStyle={[styles.dropdownMenu, { zIndex: 9999 }]}
                    maxHeight={300}
                />

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



                {loading && ageValue && townValue ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={'small'} />
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        <FlatList
                            data={filteredVoters}
                            keyExtractor={item => item.voter_id.toString()}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={!isDropdownOpen}
                            style={{
                                flex: 1,
                                backgroundColor: 'red'

                            }}
                            renderItem={({ item }) => (
                                <Pressable style={styles.voterItem}>
                                    <View style={styles.voterDetails}>
                                        <View style={styles.voterIdContainer}>
                                            <Text>{item.voter_id}</Text>
                                        </View>
                                        <Text>{item.voter_name}</Text>
                                    </View>
                                </Pressable>
                            )}
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

export default AgewiseVoters;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
        height: height * 0.65,
    },
    dropdown: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: '#9095A1',
        marginVertical: 10,
    },
    dropdownContainer: {
        width: "100%",
    },
    dropdownMenu: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: '#9095A1',
    },
    searchTextInput: {
        borderColor: '#9095A1',
        borderRadius: 4,
        marginVertical: 10,
    },
    placeholder: {
        color: '#9095A1',
        marginLeft: 15,
    },
    listContainer: {
        width: '100%',
        // height: height * 0.7,
        zIndex: 1,
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
        borderColor: '#9095A1',
    },
    voterDetails: {
        flexDirection: 'row',
        gap: 10,
    },
    voterIdContainer: {
        borderRightWidth: 1,
        borderColor: '#D9D9D9',
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
        marginTop: 50,
    },
});


