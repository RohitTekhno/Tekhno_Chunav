import { Dimensions, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import EditVoterForm from '../ReusableCompo/EditVoterForm'
import { LinearGradient } from 'expo-linear-gradient'
import { ActivityIndicator } from 'react-native'
import { TouchableOpacity } from 'react-native'
import axios from 'axios'
import { Alert } from 'react-native'


const { height, width } = Dimensions.get('screen');
const UpdateVoter = () => {
    const [voters, setVoters] = useState([]);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState(null);
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
        setLoading(true);
        setSearchText(text);
        const filtered = voters.filter(voter =>
            voter.voter_id.toString().includes(text) || voter.voter_name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredVoters(filtered);
        setLoading(false);
    };


    const handleVoterEditForm = (voter_id) => {
        fetchVoterDetails(voter_id);
        setFormVisible(true);
    };


    const handleCloseEditForm = () => {
        setFormVisible(false)
        setSelectedVoter(null)
    }

    const handleSelectedVoterDetails = (newDetails) => {
        const updatedFilteredVoters = filteredVoters.map(voter => {
            if (voter.voter_id.toString() === newDetails.voter_id.toString()) {
                return { ...voter, ...newDetails }; 
            }
            return voter; 
        });

        setFilteredVoters(updatedFilteredVoters);
    }


    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    useEffect(() => {
        setLoading(true);
        axios.get('http://192.168.200.23:8000/api/total_voters/')
            .then(response => {
                const votersData = response.data;
                setVoters(votersData);
                // setFilteredVoters(votersData);
                // setInitialVoters(votersData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching voters data:', error);
                setLoading(false);
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
            <View style={[styles.itemContainer, { backgroundColor }]}>
                <TouchableOpacity style={styles.voterRecord} onPress={() => { handleVoterEditForm(item.voter_id) }}>
                    <View style={styles.idSection}>
                        <Text style={styles.itemText}>{item.voter_id}</Text>
                    </View>
                    <View style={styles.nameSection}>
                        <Text style={styles.itemText}>{toTitleCase(item.voter_name)}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };



    return (
        <View style={styles.container}>

            <TextInput
                style={styles.searchBar}
                placeholder="Search by ID or Name"
                value={searchText}
                onChangeText={handleSearch}
            />

            {(loading) ? (

                < View style={styles.loadingContainer}>
                    <ActivityIndicator size={'small'} color={'black'} />
                    <Text>wait a minute...</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={filteredVoters}
                        keyExtractor={item => item.voter_id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.flatListContent}
                        extraData={filteredVoters} // This helps in ensuring re-render
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
    )
}

export default UpdateVoter

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    gradient: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    loadingContainer: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.05
    },
    searchBar: {
        width: "100%",
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 20,
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