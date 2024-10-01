import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Dimensions, TouchableOpacity, Pressable, Alert, } from 'react-native';
import axios from 'axios';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import { ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import EditVoterForm from '../../ReusableCompo/EditVoterForm';

const { width, height } = Dimensions.get('screen');

const Totalvoters = () => {

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
        axios.get(`http://192.168.200.23:8000/api/voters/${voter_id}`)
            .then(response => {
                setSelectedVoter(response.data);
            })
            .catch(error => {
                console.error('Error fetching voter details:', error);
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
        setLoading(true);
        axios.get('http://192.168.200.23:8000/api/total_voters/')
            .then(response => {
                const votersData = response.data;
                setVoters(votersData);
                setFilteredVoters(votersData);
                setInitialVoters(votersData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching voters data:', error);
                setLoading(false);
            });


        axios.get('http://192.168.200.23:8000/api/voter_updated_counts/')
            .then(response => {
                const { updated_count, remaining_count } = response.data;
                setUpdatedVoters(updated_count);
                setRemainingVoters(remaining_count);
            })
            .catch(error => {
                console.error('Error fetching voter counts:', error);
            });
    }, []);




    const renderItem = ({ item }) => {
        let backgroundColor = 'white';

        if (item.voter_favour_id === 1) {
            backgroundColor = '#d3f5d3';
        } else if (item.voter_favour_id === 2) {
            backgroundColor = '#f5d3d3';
        } else if (item.voter_favour_id === 3) {
            backgroundColor = '#f5f2d3';
        }

        return (
            <TouchableOpacity style={[styles.itemContainer, { backgroundColor }]} onPress={() => { handleVoterEditForm(item.voter_id) }}>
                <View style={styles.idSection}>
                    <Text style={styles.itemText}>{item.voter_id}</Text>
                </View>
                <View style={styles.nameSection}>
                    <Text style={styles.itemText}>{toTitleCase(item.voter_name)}</Text>
                </View>
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
                <LinearGradient
                    colors={['#3C4CAC', '#F04393']}
                    locations={[0.3, 1]}
                    style={styles.gradient}
                >
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search by ID or Name"
                        value={searchText}
                        onChangeText={handleSearch}
                    />


                    <View style={styles.voterCountContainer}>
                        <Text style={styles.updatedVotersText}>Updated Voters: {updatedVoters}</Text>
                        <Text style={styles.remainingVotersText}>Remaining Voters: {remainingVoters}</Text>
                    </View>
                </LinearGradient>

                {(loading) ? (

                    < View style={styles.loadingContainer}>
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
                        <EditVoterForm
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
export default Totalvoters;


const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        backgroundColor: 'white',
    },
    gradient: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.05
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
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
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
    voterRecord: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
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
