import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Pressable, Animated, Alert } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BoothUserContext } from './ContextApi/BuserContext';
// import TownVoterDetailsPopup from './TownVoterDetailsPopup';

const { height, width } = Dimensions.get('window');

export default function BoothVotedList({ route, navigation }) {
  const { buserId } = useContext(BoothUserContext);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [clickedVoter, setClickedVoter] = useState(null);
  const [animatedValue] = useState(new Animated.Value(1));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await axios.get(`http://192.168.200.23:8000/api/voted_voters_list_By_booth_user/${buserId}/1/`);
        if (response.data.voters && Array.isArray(response.data.voters)) {
          setVoters(response.data.voters);
          setFilteredVoters(response.data);
        } else {
          setError('Unexpected API response format.');
        }
      } catch (error) {
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVoters();
  }, [buserId]);

  useEffect(() => {
    const filtered = voters.filter(voter =>
      voter.voter_id.toString().includes(search) ||
      voter.voter_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredVoters(filtered);
  }, [search, voters]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'small'} />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleVoterPress = (voter) => {
    setClickedVoter(voter.voter_id);

    // Fetch voter details and show modal
    fetchVoterDetails(voter.voter_id);

    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const fetchVoterDetails = (voter_id) => {
    axios.get(`http://192.168.200.23:8000/api/voters/${voter_id}`)
      .then(response => {
        setSelectedVoter(response.data); // Set selected voter details
        setIsModalVisible(true); // Show the modal
      })
      .catch(error => {
        console.error('Error fetching voter details:', error);
        Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
      });
  };

  const renderItem = ({ item }) => {
    const isClicked = item.voter_id === clickedVoter;

    return (
      <Pressable onPress={() => handleVoterPress(item)}>
        <Animated.View
          style={[
            styles.voterItem,
            isClicked && {
              transform: [{ scale: animatedValue }], // Apply the animation
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 9,
              elevation: 10, // Add shadow for Android
            }
          ]}
        >
          <View style={styles.voterDetails}>
            <View style={{
              borderRightWidth: 1, borderColor: '#D9D9D9',
              width: 60, alignItems: 'center',
            }}>
              <Text>{item.voter_id}</Text>
            </View>
            <Text>{item.voter_name}</Text>
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Pressable onPress={handleGoBack}>
          <Icon name='chevron-left' size={25} color={'black'} />
        </Pressable>

        <Text style={styles.text}>Voters</Text>

        <Pressable>
          <AntDesign name="bells" size={24} color="black" />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="grey" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder='Search by voter’s name or ID'
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredVoters}
        keyExtractor={item => item.voter_id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noDataText}>No results found</Text>}
      />

      {/* Modal to show selected voter details */}
      {/* <TownVoterDetailsPopup 
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        selectedVoter={selectedVoter}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: 'white',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  text: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  searchContainer: {
    borderColor: '#9095A1',
    borderWidth: 1.5,
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
  listContent: {
    paddingBottom: 10,
  },
  voterItem: {
    borderRadius: 5,
    paddingVertical: 12,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.8,
    borderColor: '#919090',
    backgroundColor: '#fff',
  },
  voterDetails: {
    flexDirection: 'row',
    gap: 10,
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
});
