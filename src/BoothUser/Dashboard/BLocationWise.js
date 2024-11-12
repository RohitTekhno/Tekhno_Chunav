import { Dimensions, StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import { BoothUserContext } from '../../ContextApi/BuserContext';


const { width, height } = Dimensions.get('window');
const scaleFontSize = (size) => Math.round(size * width * 0.0025);


export default function BLocationWise({ navigation }) {
    const { buserId } = useContext(BoothUserContext);
    const [boothValue, setBoothValue] = useState(null);
    const [boothItems, setBoothItems] = useState([]);
    const [locationValue, setLocationValue] = useState(null);
    const [locationItems] = useState([
        { label: 'In City', value: 1 },      // ID 1 for In City
        { label: 'Near City', value: 2 },    // ID 2 for Near City
        { label: 'Out of City', value: 3 }   // ID 3 for Out of City
    ]);

    const [voterData, setVoterData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBoothData();
    }, []);

    const fetchBoothData = async () => {
        try {
            const response = await axios.get(`http://192.168.1.8:8000/api/booth_user_info/${buserId}/`);
            const boothOptions = [];

            // Extract booth_ids and booth_names from the response
            response.data.forEach(item => {
                const { booth_ids, booth_names } = item;
                booth_ids.forEach((id, index) => {
                    if (booth_names[index]) {
                        boothOptions.push({
                            label: `${id} - ${booth_names[index]}`, // Combining booth_id and booth_name
                            value: id,
                        });
                    }
                });
            });

            setBoothItems(boothOptions);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching booth data:', error);
            setLoading(false);
        }
    };

    const fetchVoterData = async () => {
        if (boothValue && locationValue) {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://192.168.1.8:8000/api/get_voter_current_location_details_by_booth/booth_id/${boothValue}/city_id/${locationValue}/`
                );
                setVoterData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching voter data:', error);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchVoterData();
    }, [boothValue, locationValue]);

    const renderVoterItem = ({ item }) => (
        <View style={styles.voterItem}>
            <Text style={styles.voterText}>ID: {item.voter_id}</Text>
            <Text style={styles.voterText}>Name: {item.voter_name}</Text>
            <Text style={styles.voterText}>
                Contact: {item.voter_contact_number ? item.voter_contact_number : 'N/A'}
            </Text>
            <Text style={styles.voterText}>
                Location: {item.voter_current_location ? item.voter_current_location : 'N/A'}
            </Text>
        </View>
    );

    const filteredVoterData = voterData.filter((voter) =>
        voter.voter_name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    data={boothItems}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Booth"
                    searchPlaceholder="Search booth..."
                    value={boothValue}
                    onChange={(item) => setBoothValue(item.value)}
                />

                {boothValue && (
                    <Dropdown
                        style={styles.dropdown}
                        containerStyle={styles.dropdownContainer}
                        data={locationItems}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Location"
                        value={locationValue}
                        onChange={(item) => setLocationValue(item.value)}
                    />
                )}

                {boothValue && locationValue && (
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search by voter name..."
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                )}
                <FlatList
                    data={filteredVoterData}
                    keyExtractor={(item) => item.voter_id.toString()}
                    renderItem={renderVoterItem}
                    ListHeaderComponent={loading && (
                        <View style={styles.loadingContainer} >
                            <ActivityIndicator size="small" color='black' />
                            <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    )}
                    ListEmptyComponent={!loading && (<Text style={{
                        textAlign: 'center', marginTop: 20,
                        fontSize: 18, color: 'grey', fontWeight: '600'
                    }}>No voters found.</Text>)}
                />
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: 'white'
    },
    contentContainer: {
        flex: 1,
    },
    dropdown: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: 'black',
    },
    dropdownContainer: {
        width: '90%',
        borderColor: '#9095A1',
        borderRadius: 8,
    },
    searchBar: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 8,
        marginVertical: 10,
        borderColor: 'black',
    },
    voterItem: {
        padding: 10,
        borderWidth: 0.5,
        marginVertical: 5,
        borderRadius: 5,
        borderColor: '#9095A1',
    },
    voterText: {
        fontSize: 16,
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
