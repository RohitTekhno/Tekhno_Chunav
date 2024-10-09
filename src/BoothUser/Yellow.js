

import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Pressable, Alert } from 'react-native';
import { VoterContext } from './VoterContext';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

export default function Yellow({ route, navigation }) {
  const { yellowRecords } = route.params;
  const { voters, setVoters } = useContext(VoterContext);
  const [colorLegendModalVisible, setColorLegendModalVisible] = useState(false);
  const [selectedVoterId, setSelectedVoterId] = useState(null);

  // Function to send updated color state to the backend
  const sendColorToAPI = async (voterId, voterFavourId) => {
    try {
      const response = await axios.put(`http://192.168.200.23:8000/api/favour/${voterId}/`, {
        voter_id: voterId,
        voter_favour_id: voterFavourId
      });
      console.log('API Response:', response.data);
      Alert.alert('Success', 'Color updated successfully.');
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const handleColorSelection = (voterId, selectedColor) => {
    let voterFavourId;

    // Determine voterFavourId based on selected color
    if (selectedColor === 'green') {
      voterFavourId = 1; // Favourable
    } else if (selectedColor === 'red') {
      voterFavourId = 2; // Non-Favourable
    }

    // Update the color locally in the state
    setVoters(prevVoters => {
      return prevVoters.map(voter => {
        if (voter.voter_id === voterId) {
          return { ...voter, color: selectedColor };
        }
        return voter;
      });
    });

    // Send the updated color to the API
    sendColorToAPI(voterId, voterFavourId);

    // Close the modal and navigate back
    setColorLegendModalVisible(false);
    navigation.goBack();
  };

  const openColorLegendModal = (voterId) => {
    setSelectedVoterId(voterId);
    setColorLegendModalVisible(true);
  };

  const renderVoterItem = ({ item }) => (
    <View style={[styles.voterItem, { backgroundColor: getBackgroundColor(item.color || 'yellow') }]}>
      <Text style={styles.voterText}>{`${item.voter_id} - ${item.voter_name}`}</Text>
      <TouchableOpacity style={styles.closeCircle} onPress={() => openColorLegendModal(item.voter_id)}>
        <View style={styles.circle}></View>
      </TouchableOpacity>
    </View>
  );

  const getBackgroundColor = (color) => {
    switch (color) {
      case 'green':
        return '#d4edda';
      case 'red':
        return '#f8d7da';
      case 'yellow':
        return '#fff3cd';
      default:
        return '#f7f5fa'; // Default background color for yellow records
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name='chevron-left' size={25} color={'black'} />
        </Pressable>
        <Text style={styles.text}>Doubted</Text>
        <Pressable >
          <Icon name='' size={25} color={'black'} />
        </Pressable>
      </View>

      <FlatList
        data={yellowRecords}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderVoterItem}
        contentContainerStyle={styles.voterList}
      />

      <Modal
        visible={colorLegendModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setColorLegendModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.colorLegendModalContainer}>
            {[
              { color: 'green', label: 'Favourable' },
              { color: 'red', label: 'Non-Favourable' },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.legendItem}
                onPress={() => handleColorSelection(selectedVoterId, item.color)}
              >
                <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10%',
  },
  text: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },


  closeCircle: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 25,
    height: 25,
    backgroundColor: 'black',
    borderRadius: 50,
  },

  voterList: {
    paddingVertical: 10,
  },
  voterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  voterText: {
    flex: 1,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 20,
    backgroundColor: 'black',
    width: '100%',
  },
  menuButton: {
    position: 'absolute',
    left: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '99%',
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: '#d4edda',
  },
  listItemText: {
    fontSize: 18,
    marginRight: 10,
  },
  indexText: {
    width: 30,
    textAlign: 'center',
  },
  idText: {
    width: 80,
    textAlign: 'center',
  },
  nameText: {
    flex: 1,
    textAlign: 'left',
  },
  checkboxContainer: {
    flexDirection: 'row',
  },
  checkbox: {
    width: 30,
    height: 30,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorLegendModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: 'black',
  },
});

