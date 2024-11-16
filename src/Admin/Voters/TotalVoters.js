import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Dimensions, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import EditVoterForm from '../../ReusableCompo/EditVoterForm';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

const { width, height } = Dimensions.get('screen');

const Totalvoters = () => {
    const { language } = useContext(LanguageContext);
    const [voters, setVoters] = useState([]);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [updatedVoters, setUpdatedVoters] = useState(0);
    const [remainingVoters, setRemainingVoters] = useState(0);
    const [sortState, setSortState] = useState(0);
    const [initialVoters, setInitialVoters] = useState([]);
    const [isFormVisible, setFormVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchVoterDetails = async (voter_id) => {
        try {
            const response = await axios.get(`http://192.168.1.8:8000/api/voters/${voter_id}`);
            setSelectedVoter(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
        }
    };
    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = voters.filter(voter =>
            voter.voter_id.toString().includes(text) || (voter.voter_name && voter.voter_name.toLowerCase().includes(text.toLowerCase()))
        );
        setFilteredVoters(filtered);
    };


    const handleVoterEditForm = (voter_id) => {
        fetchVoterDetails(voter_id);
        setFormVisible(true);
    };


    const handleCloseEditForm = () => {
        setFormVisible(false);
        setSelectedVoter(null);
    };

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const sortVotersAlphabetically = () => {
        let sortedVoters;
        if (sortState === 0) {
            sortedVoters = [...filteredVoters].sort((a, b) => a.voter_name.localeCompare(b.voter_name));
            setSortState(1);
        } else if (sortState === 1) {
            sortedVoters = [...filteredVoters].sort((a, b) => b.voter_name.localeCompare(a.voter_name));
            setSortState(2);
        } else {
            sortedVoters = initialVoters;
            setSortState(0);
        }
        setFilteredVoters(sortedVoters);
    };

    const handleSelectedVoterDetails = (newDetails) => {
        const updatedFilteredVoters = filteredVoters.map(voter =>
            voter.voter_id.toString() === newDetails.voter_id.toString() ? { ...voter, ...newDetails } : voter
        );
        setFilteredVoters(updatedFilteredVoters);
    };

    const fetchVoterData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://192.168.1.8:8000/api/total_voters/');
            const votersData = response.data;
            setVoters(votersData);
            setFilteredVoters(votersData);
            setInitialVoters(votersData);
        } catch (error) {
            Alert.alert('Error fetching voters data:', error.toString ? error.toString() : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const fetchVoterCounts = async () => {
        try {
            const response = await axios.get('http://192.168.1.8:8000/api/voter_updated_counts/');
            const { updated_count, remaining_count } = response.data;
            setUpdatedVoters(updated_count);
            setRemainingVoters(remaining_count);
        } catch (error) {
            Alert.alert('Error fetching voter counts:', error.toString ? error.toString() : 'Unknown error');
        }
    };

    useEffect(() => {
        fetchVoterData();
        fetchVoterCounts();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchVoterData();
        await fetchVoterCounts();
        setRefreshing(false);
    };

    const renderItem = ({ item }) => {
        let backgroundColor = 'white';

        switch (item.voter_favour_id) {
            case 1:
                backgroundColor = '#d3f5d3';
                break;
            case 2:
                backgroundColor = '#f5d3d3';
                break;
            case 3:
                backgroundColor = '#f5f2d3';
                break;
            case 4:
                backgroundColor = '#c9daff';
                break;
            case 5:
                backgroundColor = 'skyblue';
                break;
            case 6:
                backgroundColor = '#fcacec';
                break;
            case 7:
                backgroundColor = '#dcacfa';
                break;

            default:
                backgroundColor = 'white';
        }

        return (
            <TouchableOpacity style={[styles.itemContainer, { backgroundColor }]} onPress={() => handleVoterEditForm(item.voter_id)}>
                <View style={styles.idSection}>
                    <Text style={styles.itemText}>{item.voter_id}</Text>
                </View>
                <View style={styles.nameSection}>
                    <Text style={styles.itemText}>{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#3C4CAC', '#F04393']} locations={[0.3, 1]} style={styles.gradient}>
                <TextInput
                    style={styles.searchBar}
                    placeholder={language === 'en' ? 'search by voter’s name or ID' : 'मतदाराचे नाव किंवा आयडी द्वारे शोधा'}
                    value={searchText}
                    onChangeText={handleSearch}
                />
                <View style={styles.voterCountContainer}>
                    <Text style={styles.updatedVotersText}>{language === 'en' ? 'Updated Voters' : 'अपडेट झालेले मतदार :'} {updatedVoters}</Text>
                    <Text style={styles.remainingVotersText}>{language === 'en' ? 'Remaining Voters' : 'उरलेले मतदार :'} {remainingVoters}</Text>
                </View>
            </LinearGradient>

            <FlatList
                data={filteredVoters}
                keyExtractor={item => item.voter_id.toString()}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3C4CAC']} />}
                contentContainerStyle={styles.flatListContent}
                ListHeaderComponent={loading && <LoadingListComponent />}
                ListEmptyComponent={!loading && <EmptyListComponent />}
            />
            <EditVoterForm
                isVisible={isFormVisible}
                onClose={handleCloseEditForm}
                selectedVoter={selectedVoter}
                onEditVoter={handleSelectedVoterDetails}
            />
        </View >
    );
};

export default Totalvoters;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    gradient: {
        paddingHorizontal: 10,
        borderRadius: 10,
        paddingVertical: 5,
    },
    loadingContainer: {
        height: '100%',
        paddingVertical: 20,
        alignItems: 'center',
    },
    searchBar: {
        width: "100%",
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: '5%',
        backgroundColor: '#fff',
        alignSelf: 'center',
    },
    voterCountContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
    updatedVotersText: {
        color: '#43eb34',
        fontSize: height * 0.025,
        fontWeight: 'bold',
    },
    remainingVotersText: {
        color: '#f2fc28',
        fontSize: height * 0.025,
        fontWeight: 'bold',
        marginTop: 5,
    },
    itemContainer: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    idSection: {
        width: '20%',
        borderRightWidth: 1,
        borderRightColor: 'black',
        paddingRight: 10,
        alignItems: 'center',
    },
    nameSection: {
        width: '80%',
        paddingLeft: 10,
    },
    itemText: {
        fontSize: height * 0.018,
    },
    flatListContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});
