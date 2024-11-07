import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Dimensions, TouchableOpacity, Pressable, Alert, } from 'react-native';
import axios from 'axios';
import HeaderFooterLayout from './HeaderFooterLayout';
import { ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import BoothEditVoterForm from './BoothEditVoterForm';
import { UserContext } from './Neta/UserProvider';

const { width, height } = Dimensions.get('screen');

export default function BoothVotersList() {
    const { userId } = useContext(UserContext);
    const [voters, setVoters] = useState([]);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [updatedVoters, setUpdatedVoters] = useState(0);
    const [remainingVoters, setRemainingVoters] = useState(0);
    const [sortState, setSortState] = useState(0);
    const [initialVoters, setInitialVoters] = useState([]);
    const [isFormVisible, setFormVisible] = useState(false)

    const fetchVoterDetails = (voter_id) => {
        axios.get(`http://192.168.1.31:8000/api/voters/${voter_id}`)
            .then(response => {
                setSelectedVoter(response.data);
            })
            .catch(error => {
                Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
            });
    };

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = voters.filter(voter =>
            voter.voter_id.toString().includes(text) || voter.voter_name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredVoters(filtered);
    };


    const handleVoterEditForm = (voter_id) => {
        fetchVoterDetails(voter_id);
        setFormVisible(true);
    };


    const handleCloseEditForm = () => {
        setFormVisible(false)
        setSelectedVoter(null)
    }

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };


    const sortVotersAlphabetically = () => {
        if (sortState === 0) {
            const sortedVoters = [...filteredVoters].sort((a, b) => {
                const nameA = a.voter_name ? a.voter_name.toLowerCase() : '';
                const nameB = b.voter_name ? b.voter_name.toLowerCase() : '';
                return nameA.localeCompare(nameB);
            });
            setFilteredVoters(sortedVoters);
            setSortState(1);
        } else if (sortState === 1) {
            const sortedVoters = [...filteredVoters].sort((a, b) => {
                const nameA = a.voter_name ? a.voter_name.toLowerCase() : '';
                const nameB = b.voter_name ? b.voter_name.toLowerCase() : '';
                return nameB.localeCompare(nameA);
            });
            setFilteredVoters(sortedVoters);
            setSortState(2);
        } else {
            setFilteredVoters(initialVoters);
            setSortState(0);
        }
    };


    const handleSelectedVoterDetails = (newDetails) => {

        const updatedFilteredVoters = filteredVoters.map(voter => {
            if (voter.voter_id.toString() === newDetails.voter_id.toString()) {
                return { ...voter, ...newDetails };
            }
            return voter;
        });

        setFilteredVoters(updatedFilteredVoters);
    }


    useEffect(() => {
        if (userId) {
            setLoading(true);
            axios.get(`http://192.168.1.31:8000/api/get_voters_by_user_wise/${userId}/`)
                .then(response => {
                    const votersData = response.data.voters;
                    setVoters(votersData);
                    setFilteredVoters(votersData);
                    setInitialVoters(votersData);
                    setLoading(false);
                })
                .catch(error => {
                    Alert.alert('Error fetching voters data:', error);
                    setLoading(false);
                });
        } else {
            Alert.alert("userId is not available.");
        }
    }, [userId]);




    const renderItem = ({ item }) => {
        let colorBarStyle = {};


        if (item.voter_favour_id === 1) {
            colorBarStyle = { backgroundColor: '#1bc23a' };
        } else if (item.voter_favour_id === 2) {
            colorBarStyle = { backgroundColor: '#f23b38' };
        } else if (item.voter_favour_id === 3) {
            colorBarStyle = { backgroundColor: '#faf323' };
        } else if (item.voter_favour_id === 4) {
            colorBarStyle = { backgroundColor: '#214dfc' };
        }

        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => { handleVoterEditForm(item.voter_id) }}>
                <View style={styles.idSection}>
                    <Text style={styles.itemText}>{item.voter_id}</Text>
                </View>
                <View style={styles.nameSection}>
                    <Text style={styles.itemText}>{toTitleCase(item.voter_name)}</Text>
                </View>
                <View style={[styles.colorBar, colorBarStyle]} />
            </TouchableOpacity>
        );
    };

    return (
        <HeaderFooterLayout
            headerText="Total Voters"
            showFooter={false}
            leftIcon={true}
            rightIcon={true}
            leftIconName="chevron-left"
            rightIconName=""
        // onRightIconPress={sortVotersAlphabetically}
        >
            <View style={styles.container}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search by ID or Name"
                    value={searchText}
                    onChangeText={handleSearch}
                />


                {(loading) ? (

                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={'small'} />
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <>
                        < FlatList
                            data={filteredVoters}
                            keyExtractor={item => item.voter_id.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={styles.flatListContent}
                        />
                        <BoothEditVoterForm
                            isVisible={isFormVisible}
                            onClose={handleCloseEditForm}
                            selectedVoter={selectedVoter}
                            onEditVoter={handleSelectedVoterDetails}
                        />
                    </>
                )}
            </View>
        </HeaderFooterLayout >
    );
}



const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        backgroundColor: 'white',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.05
    },
    searchBar: {
        width: "100%",
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: '5%',
        backgroundColor: '#fff',
        alignSelf: 'center',
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
        position: 'relative',
    },
    voterRecord: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    idSection: {
        width: '18%',
        borderRightWidth: 1,
        borderRightColor: 'black',
        paddingRight: 10,
        alignItems: 'center',
    },
    nameSection: {
        width: '72%',
        paddingLeft: 5,
    },
    colorBar: {
        width: 10,
        height: '150%',
        borderRadius: 5,
        position: 'absolute',
        right: 2,
    },
    itemText: {
        fontSize: height * 0.018,
    },
    flatListContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});
