
import React, { useState, useEffect, useContext, memo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Dimensions, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BoothEditVoterForm from '../../ReusableCompo/BoothEditVoterForm';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
const { width, height } = Dimensions.get('screen');

export default function BoothVoters() {
  const { buserId } = useContext(BoothUserContext);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [sortState, setSortState] = useState(0);
  const [initialVoters, setInitialVoters] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [thumbsUpState, setThumbsUpState] = useState({});
  const { language, toggleLanguage } = useContext(LanguageContext);

  // Fetch voter details
  const fetchVoterDetails = (voter_id) => {
    axios.get(`http://192.168.1.8:8000/api/voters/${voter_id}`)
      .then(response => {
        setSelectedVoter(response.data);
      })
      .catch(error => {
        console.error('Error fetching voter details:', error.toString ? error.toString() : 'Unknown error');
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
    setFormVisible(false);
    setSelectedVoter(null);
    fetchVotersData();
  };

  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleSelectedVoterDetails = (newDetails) => {
    const updatedFilteredVoters = filteredVoters.map(voter => {
      if (voter.voter_id.toString() === newDetails.voter_id.toString()) {
        return { ...voter, ...newDetails };
      }
      return voter;
    });

    setFilteredVoters(updatedFilteredVoters);
  };

  const handleThumbsUpToggle = (voter_id) => {
    setThumbsUpState(prevState => ({
      ...prevState,
      [voter_id]: !prevState[voter_id]
    }));
  };

  const updateVoterThumbStatus = async (voterId, thumbStatus) => {
    try {
      const apiUrl = `http://192.168.1.8:8000/api/voter_confirmation/${voterId}/`;
      const response = await axios.put(apiUrl, {
        voter_id: voterId,
        voter_vote_confirmation_id: thumbStatus,
      });

      if (response.status !== 200) {
        throw new Error('Failed to update thumb status');
      }

      console.log('Thumb status updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating thumb status:', error.message);
      Alert.alert('Error', 'Failed to update thumb status. Please try again.');
      return false;
    }
  };

  const toggleThumb = async (voterId) => {
    try {
      // Find the voter in the current list of voters
      const voter = voters.find((item) => item.voter_id === voterId);
      if (!voter) {
        Alert.alert('Error', 'Voter not found');
        return;
      }

      // Toggle the thumb status (voted status) between `1` (voted) and `null` (not voted)
      const updatedThumbStatus = voter.voted === 1 ? null : 1;

      // Call the function to update thumb status in the backend
      const updateResponse = await updateVoterThumbStatus(voterId, updatedThumbStatus);

      // If the update is successful, update the local state
      if (updateResponse) {
        setVoters((prevVoters) =>
          prevVoters.map((item) =>
            item.voter_id === voterId
              ? { ...item, voted: updatedThumbStatus }
              : item
          )
        );

        setFilteredVoters((prevFiltered) =>
          prevFiltered.map((item) =>
            item.voter_id === voterId
              ? { ...item, voted: updatedThumbStatus }
              : item
          )
        );

        // Update thumbsUpState to reflect the change in the icon's fill status
        setThumbsUpState((prevState) => ({
          ...prevState,
          [voterId]: updatedThumbStatus === 1, // true for filled black, false for outlined
        }));
      }
    } catch (error) {
      console.error('Error toggling thumb status:', error.message);
      Alert.alert('Error', 'Failed to toggle thumb status. Please try again.');
    }
  };

  const fetchVotersData = () => {
    setLoading(true);
    axios.get(`http://192.168.1.8:8000/api/get_voters_by_user_wise/${buserId}/`)
      .then(response => {
        const votersData = response.data.voters;

        // Set the voter data and filtered data
        setVoters(votersData);
        setFilteredVoters(votersData);
        setInitialVoters(votersData);

        // Map the thumbs-up state based on voter_vote_confirmation_id
        const thumbsState = {};
        votersData.forEach(voter => {
          thumbsState[voter.voter_id] = voter.voter_vote_confirmation_id === 1;
        });
        setThumbsUpState(thumbsState);

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching voters data:', error.toString ? error.toString() : 'Unknown error');
        setLoading(false);
      });
  };


  const handleRefresh = () => {
    setRefreshing(true);
    fetchVotersData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchVotersData();
  }, []);

  const renderItem = ({ item, index }) => {
    const isThumbsUp = thumbsUpState[item.voter_id];
    let color = 'transparent';

    if (item.voter_favour_id === 1) {
      color = '#d3f5d3';
    } else if (item.voter_favour_id === 2) {
      color = '#fededd';
    } else if (item.voter_favour_id === 3) {
      color = '#f8ff96';
    } else if (item.voter_favour_id === 4) {
      color = '#6c96f0';
    } else if (item.voter_favour_id === 5) {
      color = '#c5d7fc';
    } else if (item.voter_favour_id === 6) {
      color = '#fcaef2';
    } else if (item.voter_favour_id === 7) {
      color = '#c86dfc';
    }

    return (
      <View style={styles.itemContainer}>
        <View style={[styles.idSection, { backgroundColor: color }]}>
          <Text style={styles.itemText}>{item.voter_id}</Text>
        </View>
        <TouchableOpacity style={styles.nameSection} onPress={() => handleVoterEditForm(item.voter_id)}>
          <Text style={styles.itemText}>{language === 'en' ? 'Name' : 'नाव'} : {toTitleCase(item.voter_name_mar)}</Text>
          <Text style={styles.itemText}>{language === 'en' ? 'Name' : 'नाव'} : {toTitleCase(item.voter_name)}</Text>
          <Text style={styles.itemTown}>{language === 'en' ? 'Contact' : 'संपर्क'} : {item.voter_contact_number}</Text>
          <Text style={styles.itemBooth}>{language === 'en' ? 'Booth' : 'बूथ'} : {item.booth_name}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleThumb(item.voter_id)} style={styles.thumbsUpIcon}>
          <Icon name={isThumbsUp ? 'thumb-up' : 'thumb-up-off-alt'} size={24} color={thumbsUpState[item.voter_id] ? 'black' : 'grey'} />
        </TouchableOpacity>
      </View>
    );
  };




  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder={language === 'en' ? "Search by name or ID" : 'नाव किंवा आयडी द्वारे शोधा'}
        value={searchText}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredVoters}
        keyExtractor={item => item.voter_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3C4CAC']}
          />
        }
        ListHeaderComponent={loading && <LoadingListComponent />}
        ListEmptyComponent={!loading && <EmptyListComponent />}
      />

      <BoothEditVoterForm
        isVisible={isFormVisible}
        onClose={handleCloseEditForm}
        selectedVoter={selectedVoter}
        onEditVoter={handleSelectedVoterDetails}
      />
    </View >
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    width: '100%',
    height: 45,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  itemContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    // borderColor: 'black',
  },
  idSection: {
    // width: '20%',
    // borderRightWidth: 1,
    // borderRightColor: '#ccc',
    // paddingRight: 10,
    // alignItems: 'center',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,

  },
  nameSection: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  itemTown: {
    fontSize: 14,
    color: 'black',
  },
  itemBooth: {
    fontSize: 14,
    color: 'black',
  },
  thumbsUpIcon: {
    width: 30,
    alignItems: 'center',
  },
  flatListContent: {
    paddingBottom: 100,
  },

});
