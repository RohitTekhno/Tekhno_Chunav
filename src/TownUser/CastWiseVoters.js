import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableOpacity } from 'react-native';
import CustomTUserBottomTabs from '../Navigation/CustomBottonNav';
import VoterDetailsPopUp from '../ReusableCompo/VoterDetailsPopUp';
import { TownUserContext } from './ContextApi/TownUserProvider';


const { height, width } = Dimensions.get('screen')
const CastWiseVoters = () => {
    const { userId } = useContext(TownUserContext)

    const [selectedCast, setSelectedCast] = useState(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [voters, setVoters] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [loading, setLoading] = useState(false);



    const fetchCasteData = async () => {
        try {
            const response = await axios.get('http://192.168.200.23:8000/api/cast/');
            const casteData = response.data.map(cast => ({
                label: `${cast.cast_id} - ${cast.cast_name}`,
                value: cast.cast_id,
            }));
            setItems(casteData);
        } catch (error) {
            console.error('Error fetching caste data:', error);
            Alert.alert('Error', 'Failed to load caste data');
        }
    };

    const fetVotersByCastwise = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`http://192.168.200.23:8000/api/get_voters_by_town_user_and_cast/${userId}/${selectedCast}/`)
            setVoters(response.data)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

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


    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };


    useEffect(() => {
        if (selectedCast) {
            fetVotersByCastwise()
        }
    }, [selectedCast])

    useEffect(() => {

        fetchCasteData();
    }, []);

    const renderVoterItem = ({ item }) => (
        <View style={[styles.voterItem, { backgroundColor: item.color || '#FFFFFF' }]}>
            <TouchableOpacity style={styles.closeCircle} onPress={() => fetchVoterDetails(item.voter_id)}>
                <Text style={styles.voterText}>{item.voter_id} - {toTitleCase(item.voter_name)}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <CustomTUserBottomTabs showFooter={false}>
            < View style={styles.container} >
                <DropDownPicker
                    open={open}
                    value={selectedCast}
                    items={items}
                    setOpen={setOpen}
                    setValue={setSelectedCast}
                    setItems={setItems}
                    placeholder="Select Caste"
                    containerStyle={styles.picker}
                />

                {loading ?
                    (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size={'small'} color={'black'} />
                            <Text>Loading...</Text>
                        </View>
                    ) :
                    <>
                        {selectedCast ?
                            <>
                                <View style={styles.selectedCastContainer}>
                                    <FlatList
                                        data={voters}
                                        keyExtractor={(item) => item.voter_id.toString()}
                                        renderItem={renderVoterItem}
                                        contentContainerStyle={styles.voterList}
                                        ListEmptyComponent={<Text style={{ alignItems: 'center', textAlign: 'center' }}>No Data Found..</Text>}
                                    />
                                    <VoterDetailsPopUp
                                        isModalVisible={isModalVisible}
                                        selectedVoter={selectedVoter}
                                        setIsModalVisible={setIsModalVisible}
                                    />
                                </View>
                            </> :
                            <Text style={{ textAlign: 'center', fontSize: 16 }}>No selected Cast</Text>
                        }
                    </>
                }
            </View >
        </CustomTUserBottomTabs >
    )
}

export default CastWiseVoters

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginVertical: 10,
        height: height * 0.774,
        // backgroundColor: 'red',
    },
    picker: {
        width: '100%',
        marginBottom: 10,
    },
    selectedCastContainer: {
        flex: 1,

    },
    voterList: {
        paddingVertical: 10,
    },
    voterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        width: '100%',
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#D9D9D9',
    },
    voterText: {
        flex: 1,
        fontSize: 15,
    },
    loadingContainer: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    },
})