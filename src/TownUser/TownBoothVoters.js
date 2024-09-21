import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Pressable, Animated } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TownUserContext } from '../Neta/TownUserProvider';

const { height, width } = Dimensions.get('window');

export default function TownBoothVoters({ route, navigation }) {
  const { userId } = useContext(TownUserContext);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [clickedVoter, setClickedVoter] = useState(null);
  const [animatedValue] = useState(new Animated.Value(1));
  const { boothId } = route.params;

  useEffect(() => {
    const fetchVoters = async () => {
      try {

        const response = await axios.get(`http://192.168.200.23:8000/api/get_voters_by_booth/${boothId}`);
        if (response.data && response.data.voters && Array.isArray(response.data.voters)) {

          const voterData = response.data.voters.map(voter => ({
            voter_id: voter.voter_id,
            voter_name: voter.voter_name
          }));
          setVoters(voterData);
          setFilteredVoters(voterData);
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
  }, [route.params.boothId]);

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

  const handleNotificationBtn = () => {
    Alert.alert("Notification Pressed...");
  };

  const handleVoterPress = (voter) => {
    setClickedVoter(voter.voter_id);


    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const renderItem = ({ item }) => {
    const isClicked = item.voter_id === clickedVoter;

    return (
      <Pressable onPress={() => handleVoterPress(item)}>
        <Animated.View
          style={[
            styles.voterItem,
            isClicked && {
              transform: [{ scale: animatedValue }],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 9,
              elevation: 10,
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

        <Text style={styles.text}>Voters in Booth {boothId}</Text>

        <Pressable onPress={handleNotificationBtn}>
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
