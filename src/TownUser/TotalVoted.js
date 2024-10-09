import { ActivityIndicator, Alert, Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import React, { useContext, useEffect, useState, memo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TownUserContext } from './ContextApi/TownUserProvider';
import axios from 'axios';
import CustomTUserBottomTabs from '../Navigation/CustomBottonNav';
import VoterDetailsPopUp from '../ReusableCompo/VoterDetailsPopUp';

const { height, width } = Dimensions.get('screen');

const VoterItem = memo(({ item, onPress }) => (
  <Pressable style={styles.voterItem} onPress={onPress}>
    <Text style={styles.voterIdText}>{item.voter_id}</Text>
    <Text>{item.voter_name}</Text>
  </Pressable>
));

const TotalVoted = () => {
  const { userId } = useContext(TownUserContext);
  const [searchedValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);

  const searchedVoter = voters.filter(voter => {
    const boothId = voter.voter_id ? voter.voter_id.toString().toLowerCase() : '';
    const boothName = voter.voter_name ? voter.voter_name.toLowerCase() : '';
    const searchValueLower = searchedValue.toLowerCase();
    return boothId.includes(searchValueLower) || boothName.includes(searchValueLower);
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.200.23:8000/api/town_user_id/${userId}/confirmation/1/`);
      if (Array.isArray(response.data)) {
        setVoters(response.data);
      } else {
        throw new Error('Expected an array of voters');
      }
    } catch (error) {
      const message = error.response ? error.response.data.message : 'Error fetching data';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoterDetails = async (voter_id) => {
    try {
      const response = await axios.get(`http://192.168.200.23:8000/api/voters/${voter_id}`);
      setSelectedVoter(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching voter details:', error);
      Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchData} />
      </View>
    );
  }

  return (
    <CustomTUserBottomTabs showFooter={false}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="grey" />
          <TextInput
            value={searchedValue}
            onChangeText={setSearchValue}
            placeholder='Search by user’s name or ID'
            style={styles.searchInput}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='small' />
            <Text>Loading...</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {searchedVoter.length > 0 ? (
              <>
                <FlatList
                  data={searchedVoter}
                  keyExtractor={item => item.voter_id.toString()}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <VoterItem
                      item={item}
                      onPress={() => fetchVoterDetails(item.voter_id)}
                    />
                  )}
                />
                <VoterDetailsPopUp
                  isModalVisible={isModalVisible}
                  selectedVoter={selectedVoter}
                  setIsModalVisible={setIsModalVisible}
                />
              </>
            ) : (
              <Text style={styles.noDataText}>No results found</Text>
            )}
          </View>
        )}
      </View>
    </CustomTUserBottomTabs>
  );
};

export default TotalVoted;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    height: height * 0.86,
    backgroundColor: 'white',
  },
  searchContainer: {
    borderColor: '#9095A1',
    borderWidth: 1,
    borderRadius: 5,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  listContainer: {
    flex: 1,
  },
  voterItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.1,
    borderRadius: 1,
    columnGap: width * 0.03
  },
  voterIdText: {
    borderWidth: 1,
    borderColor: 'blue',
    width: 30,
    textAlign: 'center',
    borderRadius: 3,
    fontWeight: '700',
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
