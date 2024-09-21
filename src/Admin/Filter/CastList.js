import { StyleSheet, Text, View, FlatList, Pressable, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import ColorLegendModal from '../AboutUs/ColorLegendModal';

const castList = [
    { label: 'Brahmin', value: 'Brahmin' },
    { label: 'Maratha', value: 'Maratha' },
    { label: 'Kunbi', value: 'Kunbi' },
    { label: 'Wani', value: 'Wani' },
    { label: 'Maheshwari', value: 'Maheshwari' },
    { label: 'Marwadi', value: 'Marwadi' },
    { label: 'Lodhi', value: 'Lodhi' },
    { label: 'Chambhar', value: 'Chambhar' },
    { label: 'Mali', value: 'Mali' },
    { label: 'Dhangar', value: 'Dhangar' },
    { label: 'Koli', value: 'Koli' },
    { label: 'Buddhist', value: 'Buddhist' },
    { label: 'Nav Bauddha', value: 'Nav Bauddha' },
    { label: 'Parsi', value: 'Parsi' },
    { label: 'Jain', value: 'Jain' },
    { label: 'Muslim', value: 'Muslim' },
    { label: 'Christian', value: 'Christian' },
    { label: 'Sikh', value: 'Sikh' },
    { label: 'Sindhi', value: 'Sindhi' },
];

const voterNameList = [
    { id: '1', fullname: "Arnav Anil Bhagat", Voter_Favourable_Name: 'Favourable', cast: 'Brahmin', Voter_Favourable_Id: '1' },
    { id: '8', fullname: "Anil Parabh", Voter_Favourable_Name: 'Doubted', cast: 'Brahmin', Voter_Favourable_Id: '3' },
    { id: '9', fullname: "Vijay Desai", Voter_Favourable_Name: 'Pending', cast: 'Brahmin', Voter_Favourable_Id: '4' },
    { id: '10', fullname: "Sandesh Haral", Voter_Favourable_Name: 'Non-Favourable', cast: 'Brahmin', Voter_Favourable_Id: '2' },
    { id: '11', fullname: "Dipak Chaudhari", Voter_Favourable_Name: 'Favourable', cast: 'Brahmin', Voter_Favourable_Id: '1' },
    { id: '2', fullname: "Mayur", Voter_Favourable_Name: 'Non-Favourable', cast: 'Maratha', Voter_Favourable_Id: '2' },
    { id: '3', fullname: "Raghav Bhagat", Voter_Favourable_Name: 'Doubted', cast: 'Mali', Voter_Favourable_Id: '3' },
    { id: '4', fullname: "Shubham tote", Voter_Favourable_Name: 'Pending', cast: 'Dhangar', Voter_Favourable_Id: '4' },
    { id: '5', fullname: "Sujit Auti", Voter_Favourable_Name: 'Favourable', cast: 'Buddhist', Voter_Favourable_Id: '5' },
    { id: '6', fullname: "Rohit Linge", Voter_Favourable_Name: 'Chocolate', cast: 'Jain', Voter_Favourable_Id: '6' },
    { id: '7', fullname: "Rahul Tonde", Voter_Favourable_Name: 'Golden', cast: 'Sindhi', Voter_Favourable_Id: '7' },
];

const CastList = () => {
    const navigation = useNavigation();
    const [selectedCast, setSelectedCast] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [allVoterList, setAllVoterList] = useState(voterNameList);
    const [filteredVoterList, setFilteredVoterList] = useState([]);
    const [selectedVoterId, setSelectedVoterId] = useState(null);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const getFilteredVoterByCast = (voterCast) => {
        const filteredData = allVoterList.filter(voter => voter.cast === voterCast);
        setFilteredVoterList(filteredData);
    };

    const getTypeOfVoter = (voterType) => {
        updateVoterType(selectedVoterId, voterType);
    };

    const updateVoterType = (id, voterType) => {
        const updatedVoter = allVoterList.map(voter =>
            voter.id === id ? { ...voter, Voter_Favourable_Name: voterType.label, Voter_Favourable_Id: voterType.id } : voter
        );
        setAllVoterList(updatedVoter)

        const updatedVoter1 = filteredVoterList.map(voter =>
            voter.id === id ? { ...voter, Voter_Favourable_Name: voterType.label, Voter_Favourable_Id: voterType.id } : voter
        );
        setFilteredVoterList(updatedVoter1);
    };

    useEffect(() => {
        if (selectedCast) {
            getFilteredVoterByCast(selectedCast);
        }
    }, [selectedCast]);

    const getBackgroundColor = (favourableName) => {
        switch (favourableName) {
            case 'Favourable':
                return 'green';
            case 'Doubted':
                return 'yellow';
            case 'Non-Favourable':
                return '#FF3030';
            case 'Pending':
                return 'transparent';
            case 'Chocolate':
                return '#59320C';
            case 'Golden':
                return '#F99D4D';
            default:
                return 'white';
        }
    };

    return (
        <View style={{ paddingVertical: 50, paddingHorizontal: 20 }}>
            <StatusBar />
            <View style={styles.nav}>
                <Pressable onPress={handleGoBack}>
                    <Icon name='chevron-left' size={25} />
                </Pressable>

                <Text style={styles.text}>Cast List</Text>

                <Pressable onPress={() => { Alert.alert('select multiple..') }}
                    style={styles.blackCircle} />
            </View>

            <View style={styles.dropdownContainer}>
                <Dropdown
                    placeholder='Sort by caste'
                    placeholderStyle={styles.placeholderStyle}
                    search
                    searchPlaceholder='Search voter name here...'
                    data={castList}
                    value={selectedCast}
                    labelField='label'
                    valueField='value'
                    onChange={item => {
                        setSelectedCast(item.value);
                        getFilteredVoterByCast(item.value);
                    }}
                    style={styles.dropdown}
                />
            </View>

            {selectedCast && (
                <Text style={styles.selectedCastText}>{selectedCast}</Text>
            )}

            {filteredVoterList.length > 0 ? (
                <FlatList
                    data={filteredVoterList}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Pressable style={styles.voterItem}>
                            <View style={styles.voterDetails}>
                                <Text>{item.id}</Text>
                                <Text>{item.fullname}</Text>
                            </View>
                            <Pressable onPress={() => {
                                setModalVisible(true);
                                setSelectedVoterId(item.id);
                            }}
                                style={styles.blackCircle}
                            />
                        </Pressable>
                    )
                    }
                />
            ) : (
                <Text style={styles.noDataText}>No voters available for the selected caste.</Text>
            )}

            <ColorLegendModal isVisible={modalVisible}
                closeModal={() => setModalVisible(false)}
                onSelect={getTypeOfVoter}
            />
        </View >
    );
};

export default CastList;

const styles = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    blackCircle: {
        width: 20,
        height: 20,
        backgroundColor: 'black',
        borderRadius: 10,
    },
    dropdownContainer: {
        width: '100%',
        margin: 30,
        alignSelf: 'center',
    },
    dropdown: {
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#9095A1',
        borderRadius: 4,
    },
    placeholderStyle: {
        color: '#9095A1',
    },
    selectedCastText: {
        color: '#3C4CAC',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    voterItem: {
        flex: 1,
        borderRadius: 4,
        paddingVertical: 13,
        paddingHorizontal: 15,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1
    },
    voterDetails: {
        flexDirection: 'row',
        columnGap: 10
    },
    noDataText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: 'gray',
    },
});
