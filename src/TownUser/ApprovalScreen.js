import { Alert, Dimensions, StyleSheet, Text, TextInput, View, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import TempEditedVoterForm from '../ReusableCompo/TempEditedVoterForm';
import { Checkbox } from 'react-native-paper';

const { width, height } = Dimensions.get('screen');

const ApprovalScreen = ({ route }) => {
  const { Buser_id } = route.params;
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [casteOptions, setCasteOptions] = useState([]);
  const [multiSelector, setMultiSelector] = useState(false);
  const [selectedVoterIds, setSelectedVoterIds] = useState([]);
  const [message, setMessage] = useState(null)
  const statusOptions = [{ label: 'Alive', value: 1 }, { label: 'Dead', value: 2 }];
  const maritalOptions = [{ label: 'Single', value: 1 }, { label: 'Married', value: 2 }];

  const fetchUpdatedVotersToApprove = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.200.23:8000/api/get_temp_voter_data_town/${Buser_id}/`);
      setVoters(response.data);
      setFilteredVoters(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          Alert.alert('Not Found', 'Voters data not available. Please try again.');
          setMessage('Voters data not available. Please try again.')
        } else {
          Alert.alert('Error', 'Failed to fetch voters. Please try again.');
        }
      } else if (error.request) {
        Alert.alert('Network Error', 'Failed to fetch voters. Please check your internet connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdatedVoterDetails = async (voter_id) => {
    setFormVisible(true);
    try {
      const response = await axios.get(`http://192.168.200.23:8000/api/get_temp_voter_data/${voter_id}`);
      setSelectedVoter(response.data);
    } catch (error) {
      console.error('Error fetching voter details:', error);
      Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
    }
  };

  const handleVoterSelection = (voterId) => {
    setSelectedVoterIds(prevIds => prevIds.includes(voterId) ? prevIds.filter(id => id !== voterId) : [...prevIds, voterId]);
  };

  const handleApproveSelected = () => {
    setSelectedVoterIds([]);
    setMultiSelector(false);
  };

  const handleRejectSelected = () => {
    setSelectedVoterIds([]);
    setMultiSelector(false);
  };

  const fetchCasteData = async () => {
    try {
      const response = await axios.get('http://192.168.200.23:8000/api/cast/');
      const casteData = response.data.map(cast => ({
        label: `${cast.cast_id} - ${cast.cast_name}`,
        value: cast.cast_id,
      }));
      setCasteOptions(casteData);
    } catch (error) {
      console.error('Error fetching caste data:', error);
      Alert.alert('Error', 'Failed to load caste data');
    }
  };

  const getCastName = (castId) => casteOptions.find(option => option.value === castId)?.label || 'Unknown Cast';
  const getMaritalStatus = (statusId) => maritalOptions.find(option => option.value === statusId)?.label || 'Unknown Status';
  const getCurrentStatus = (statusId) => statusOptions.find(option => option.value === statusId)?.label || 'Unknown Status';

  useEffect(() => {
    setFilteredVoters(voters.filter(voter =>
      voter.voter_name?.toLowerCase().includes(searchText.toLowerCase())
    ));
  }, [searchText, voters]);

  useEffect(() => {
    fetchCasteData();
    fetchUpdatedVotersToApprove();
  }, []);


  const renderVoterItem = ({ item }) => {
    const isSelected = selectedVoterIds.includes(item.temp_voter_data_voter_id);

    return (
      <TouchableOpacity style={styles.voterItem}
        onPress={() => handleVoterSelection(item.temp_voter_data_voter_id)}
        onLongPress={() => {
          setMultiSelector(true)
          handleVoterSelection(item.temp_voter_data_voter_id)
        }}
      >
        <View>
          <Text>Voter Id: {item.temp_voter_data_voter_id}</Text>
          <Text>Name: {item.voter_name}</Text>
          {item.temp_voter_data_voter_parent_name && <Text>Parent Name: {item.temp_voter_data_voter_parent_name}</Text>}
          {item.temp_voter_data_voter_cast && <Text>Cast: {getCastName(item.temp_voter_data_voter_cast)}</Text>}
          {item.temp_voter_data_voter_live_status && <Text>Current Status: {getCurrentStatus(item.temp_voter_data_voter_live_status)}</Text>}
          {item.temp_voter_data_voter_marital_status && <Text>Marital Status: {getMaritalStatus(item.temp_voter_data_voter_marital_status)}</Text>}
          {item.temp_voter_data_voter_contact_number && <Text>Contact: {item.temp_voter_data_voter_contact_number}</Text>}
          {item.temp_voter_data_voter_gender && <Text>Gender: {item.temp_voter_data_voter_gender}</Text>}
          {item.temp_voter_data_voter_age && <Text>Age: {item.temp_voter_data_voter_age}</Text>}
        </View>
        {multiSelector ? (
          <Checkbox
            status={isSelected ? 'checked' : 'unchecked'}
            color='black'
            onPress={() => handleVoterSelection(item.temp_voter_data_voter_id)}
          />
        ) : (
          <TouchableOpacity onPress={() => fetchUpdatedVoterDetails(item.temp_voter_data_voter_id)}>
            <Feather name="edit" size={24} color="black" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder='Search voter here...'
        style={styles.searchInput}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'small'} color={'black'} />
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          <Text style={{ textAlign: 'center', padding: 10, color: 'grey' }}>{message}</Text>
          <FlatList
            data={filteredVoters}
            renderItem={renderVoterItem}
            keyExtractor={item => item.voter_id?.toString() || Math.random().toString()}
          />
        </>
      )}


      <TempEditedVoterForm
        isVisible={isFormVisible}
        onClose={() => setFormVisible(false)}
        selectedVoter={selectedVoter}
        onEditVoter={(id) => {
          const filteredVoterData = voters.filter(voter => voter.temp_voter_data_voter_id !== id);
          setFilteredVoters(filteredVoterData)
          setVoters(filteredVoterData)
        }}
      />


      {multiSelector && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.rejectButton} onPress={handleRejectSelected}>
            <Ionicons name="close-sharp" size={30} color="red" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.approveButton} onPress={handleApproveSelected}>
            <Ionicons name="checkmark-done-sharp" size={30} color="green" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  searchInput: {
    borderWidth: 0.5,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  voterItem: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    borderWidth: 0.5,
    marginVertical: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  rejectButton: {
    width: '40%',
    backgroundColor: '#FFABAB',
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
    elevation: 5,
    height: 40,
    justifyContent: 'center',
  },
  approveButton: {
    width: '40%',
    backgroundColor: '#D9F8C4',
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
    elevation: 5,
    height: 40,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ApprovalScreen;
