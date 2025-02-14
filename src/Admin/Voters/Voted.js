import { Alert, Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import VoterDetailsPopUp from '../Voters/VoterDetailsPopUp';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

const { width, height } = Dimensions.get('screen');

export default function Voted({ route }) {
    const [voters, setVoters] = useState([]);
    const { language } = useContext(LanguageContext);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchedValue, setSearchValue] = useState('');
    const [error, setError] = useState(null);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchVoterDetails = (voter_id) => {
        axios.get(`http://192.168.1.8:8000/api/voters/${voter_id}`)
            .then(response => {

                setSelectedVoter(response.data);
                setIsModalVisible(true);
            })
            .catch(error => {
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


    const serchedVoter = voters.filter(voter =>
        (voter.voter_name && voter.voter_name.toLowerCase().includes(searchedValue.toLowerCase())) ||
        (voter.voter_id && voter.voter_id.toString().includes(searchedValue))
    );

    useEffect(() => {
        setFilteredVoters(serchedVoter);
    }, [searchedValue, voters]);


    useEffect(() => {
        axios.get(`http://192.168.1.8:8000/api/vote_confirmation/1/`)
            .then(response => {

                if (response.data && Array.isArray(response.data)) {
                    setVoters(response.data);
                } else {
                    setError('Unexpected API response format.');
                }
                setLoading(false);
            })
            .catch(error => {
                Alert.alert('Error fetching voter data', error.toString ? error.toString() : 'Unknown error');

                setError('Error fetching data. Please try again later.');
                setLoading(false);
            });
    }, []);



    const getBackgroundColor = (voter_favour_id) => {
        switch (voter_favour_id) {
            case 1:
                return '#d3f5d3';
            case 2:
                return '#f5d3d3';
            case 3:
                return '#f5f2d3';
            case 4:
                return '#c9daff';
            default:
                return 'white';
        }
    };

    return (
        <HeaderFooterLayout
            headerText="Voted"
            showHeader={false}
            showFooter={false}>

            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="grey" />
                    <TextInput
                        value={searchedValue}
                        onChangeText={text => setSearchValue(text)}
                        placeholder={language === 'en' ? "Search by voter’s name or ID" : "मतदाराचे नाव किंवा आयडी द्वारे शोधा"}
                        style={styles.searchInput}
                    />
                </View>

                <View style={styles.listContainer}>
                    <FlatList
                        data={filteredVoters}
                        keyExtractor={item => item.voter_id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <Pressable style={[styles.voterItem, styles.selectedVoterItem,
                            { backgroundColor: getBackgroundColor(item.voter_favour_id) }]}
                                onPress={() => { handleVoterPress(item.voter_id) }}>
                                <View style={styles.voterDetails}>
                                    <View style={styles.indexBox}>
                                        {/* <Text style={styles.indexText}>{index + 1}</Text> */}
                                    </View>
                                    <View style={{
                                        borderRightWidth: 1, borderColor: '#D9D9D9',
                                        width: 60, alignItems: 'center',
                                    }}>
                                        <Text style={{}}>{item.voter_id}</Text>
                                    </View>
                                    <Text>{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
                                </View>
                            </Pressable>
                        )}
                        ListHeaderComponent={loading && <LoadingListComponent />}
                        ListEmptyComponent={!loading && <EmptyListComponent />}
                    />
                </View>

                <VoterDetailsPopUp
                    isModalVisible={isModalVisible}
                    selectedVoter={selectedVoter}
                    setIsModalVisible={setIsModalVisible}
                />
            </View>
        </HeaderFooterLayout>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        columnGap: 20,
        marginVertical: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },
    listContainer: {
        // flex: 1,
    },
    voterItem: {
        // flex: 1,
        borderRadius: 2,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.2,
    },
    voterDetails: {
        flexDirection: 'row',
        gap: 10
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
        backgroundColor: 'white'

    }
});