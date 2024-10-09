import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Pressable, Alert } from 'react-native';
import axios from 'axios';
import { VoterContext } from './VoterContext';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function Favour({ route, navigation }) {
  const { greenRecords } = route.params;
  const { voters, setVoters } = useContext(VoterContext);
  const [colorLegendModalVisible, setColorLegendModalVisible] = useState(false);
  const [selectedVoterId, setSelectedVoterId] = useState(null);


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


    if (selectedColor === 'red') {
      voterFavourId = 2; // 
    } else if (selectedColor === 'yellow') {
      voterFavourId = 3;
    }


    setVoters(prevVoters => {
      return prevVoters.map(voter => {
        if (voter.voter_id === voterId) {
          return { ...voter, color: selectedColor };
        }
        return voter;
      });
    });


    sendColorToAPI(voterId, voterFavourId);


    setColorLegendModalVisible(false);
    navigation.goBack();
  };

  const openColorLegendModal = (voterId) => {
    setSelectedVoterId(voterId);
    setColorLegendModalVisible(true);
  };

  const renderVoterItem = ({ item }) => (
    <View style={[styles.voterItem, { backgroundColor: getBackgroundColor(item.color || 'green') }]}>
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
        return '#d4edda';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name='chevron-left' size={25} color={'black'} />
        </Pressable>
        <Text style={styles.text}>Favourable</Text>
        <Pressable >
          <Icon name='' size={25} color={'black'} />
        </Pressable>
      </View>

      <FlatList
        data={greenRecords}
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
              { color: 'red', label: 'Non-Favourable' },
              { color: 'yellow', label: 'Doubted' },
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
