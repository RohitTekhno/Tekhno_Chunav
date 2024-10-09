import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Pressable, Animated, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TownUserContext } from './ContextApi/TownUserProvider';
import CustomTUserBottomTabs from '../Navigation/CustomBottonNav';
import VoterDetailsPopUp from '../ReusableCompo/VoterDetailsPopUp';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Checkbox } from 'react-native-paper';


const { height, width } = Dimensions.get('window');

export default Townvoterlist = ({ route, navigation }) => {
  const { userId } = useContext(TownUserContext);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [clickedVoter, setClickedVoter] = useState(null);
  const [animatedValue] = useState(new Animated.Value(1));
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSelectMultiple, setSelectMultiple] = useState(false)
  const [checkedAll, setCheckedAll] = useState(false)
  const [selectedVoterIds, setSelectedVoterIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);



  const fetchVoters = async () => {
    try {
      setRefreshing(true)
      const response = await axios.get(`http://192.168.200.23:8000/api/get_voter_list_by_town_user/${userId}/`);
      if (response.data && Array.isArray(response.data)) {
        setVoters(response.data);
        setFilteredVoters(response.data);
      } else {
        setError('Unexpected API response format...');
      }
    } catch (error) {
      setError('Error fetching data. Please try again later...');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, [userId]);


  useEffect(() => {
    const filtered = voters.filter(voter =>
      voter.voter_id.toString().includes(search) ||
      voter.voter_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredVoters(filtered);
  }, [search, voters]);


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


  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const showConfirmAlert = (message, onConfirm) => {
    Alert.alert(
      "Confirm",
      message,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: onConfirm,
        }
      ]
    );
  };

  const renderItemBgColor = (item) => {
    let backgroundColor = 'white';

    if (item.favour_id === 1) {
      backgroundColor = '#d3f5d3';
    } else if (item.favour_id === 2) {
      backgroundColor = '#f5d3d3';
    } else if (item.favour_id === 3) {
      backgroundColor = '#f5f2d3';
    }
    return backgroundColor;
  }

  const handleSelectAll = () => {
    if (checkedAll) {
      setSelectedVoterIds([]);
    } else {
      const allVoterIds = filteredVoters.map(voter => voter.voter_id);
      setSelectedVoterIds(allVoterIds);
    }
    setCheckedAll(!checkedAll);
  };

  const handleCancleAll = () => {
    setSelectedVoterIds([]);
    setCheckedAll(false);
    setSelectMultiple(false);
  };


  const send_WhatsApp_Message = async () => {
    try {
      const response = await axios.post(`http://192.168.200.23:8000/api/send_whatsapp_message/`, {
        "voter_ids": selectedVoterIds
      });

      if (response.status === 200) {
        alert("WhatsApp message sent successfully!");
        handleCancleAll()
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
    }
  };

  const send_Text_Message = async () => {
    try {
      const response = await axios.post(`http://192.168.200.23:8000/api/send_text_message/`, {
        "voter_ids": selectedVoterIds
      });

      if (response.status === 200) {
        alert("Text message sent successfully!");
        handleCancleAll()
      }
    } catch (error) {
      console.error("Error sending text message:", error);
    }
  };


  const handlePdfIconClick = async (voterId) => {
    try {
      const response = await axios.get(`http://192.168.200.23:8000/api/generate_voter_pdf/${voterId}`, {
        params: { voter_id: voterId },
        responseType: 'arraybuffer',
      });

      const base64 = btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const fileUri = FileSystem.documentDirectory + `voter_${voterId}.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert('Success', 'PDF has been saved to your device!');

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Error', 'Sharing not available on this device.');
      }

    } catch (error) {
      console.error('Error downloading PDF:', error);
      Alert.alert('Error', 'Failed to download the PDF.');
    }
  };

  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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

  const handleLongPressed = () => {
    setSelectMultiple(true)
  }


  const handleRefresh = () => {
    setRefreshing(true);
    fetchVoters();
    setRefreshing(false);
  };


  const renderItem = ({ item }) => {

    const isClicked = item.voter_id === clickedVoter;
    const isSelected = selectedVoterIds.includes(item.voter_id);

    return (
      <Pressable onPress={() => handleVoterPress(item)} onLongPress={handleLongPressed} >
        <Animated.View
          style={[
            styles.voterItem,
            isClicked && {
              transform: [{ scale: animatedValue }],
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 9,
              elevation: 10,
            }, { backgroundColor: renderItemBgColor(item) }
          ]}
        >
          <View style={styles.voterDetails}>
            <View style={{ borderRightWidth: 1, width: 60, justifyContent: 'center' }}>
              <Text>{item.voter_id}</Text>
            </View>
            <Pressable onPress={() => fetchVoterDetails(item.voter_id)} onLongPress={handleLongPressed}
              style={{ flex: 1, justifyContent: 'center' }}>
              <Text>{toTitleCase(item.voter_name)}</Text>
            </Pressable>

            {isSelectMultiple ? (
              <Checkbox
                status={isSelected ? 'checked' : 'unchecked'}
                color='black'
                onPress={() => {
                  if (isSelected) {
                    setSelectedVoterIds(prevIds => prevIds.filter(id => id !== item.voter_id));
                  } else {
                    setSelectedVoterIds(prevIds => [...prevIds, item.voter_id]);
                  }
                }}
              />
            ) : (
              <Pressable onPress={() => handlePdfIconClick(item.voter_id)} style={{ justifyContent: 'center' }}>
                <AntDesign name="download" size={height * 0.02} color="black" />
              </Pressable>
            )}
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="grey" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder='Search by voter’s name or ID'
          style={styles.searchInput}
        />
      </View>

      {isSelectMultiple && (
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxIcons}>
            <Pressable onPress={() => { showConfirmAlert("Send Message From Whatsapp", send_WhatsApp_Message) }}>
              <Icon name="whatsapp" size={30} color="green" />
            </Pressable>

            <Pressable onPress={() => { showConfirmAlert("Send Text Message", send_Text_Message) }}>
              <MaterialCommunityIcons name="message-text" size={30} color="purple" />
            </Pressable>
          </View>

          <View style={styles.checkboxActions}>
            <Pressable onPress={handleCancleAll}>
              <MaterialIcons name="cancel" size={30} color="red" />
            </Pressable>
            <Checkbox
              color='black'
              status={checkedAll ? 'checked' : 'unchecked'}
              onPress={handleSelectAll}
            />

          </View>
        </View>
      )}

      {refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'small'} color={'black'} />
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredVoters}
            keyExtractor={item => item.voter_id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            ListEmptyComponent={<Text style={styles.noDataText}>No results found</Text>}
          />

          <VoterDetailsPopUp
            isModalVisible={isModalVisible}
            selectedVoter={selectedVoter}
            setIsModalVisible={setIsModalVisible}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    height: height * 0.816,
    backgroundColor: 'white'
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
  errorText: {
    justifyContent: 'center',
    textAlign: 'center',
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
    gap: 20,
    paddingHorizontal: 20
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'gray',
  },
  loadingContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.03
  },
  checkboxIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 30
  },
  checkboxActions: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20
  }
});
