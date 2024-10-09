import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable, Alert, Modal } from 'react-native';
import { VoterContext } from './VoterContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { BoothUserContext } from './ContextApi/BuserContext';

export default function CasteList({ navigation }) {
  const { buserId } = useContext(BoothUserContext);
  const [voters, setVoters] = useState([]);
  const [selectedCast, setSelectedCast] = useState(null);
  const [colorLegendModalVisible, setColorLegendModalVisible] = useState(false);
  const [selectedVoterId, setSelectedVoterId] = useState(null);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
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

    fetchCasteData();
  }, []);

  const fetchVotersByCaste = async (castId) => {
    try {
      const response = await axios.get(`http://192.168.200.23:8000/api/get_voters_by_booth_user_and_cast/${buserId}/${castId}`, {
        params: { buserId, castId }
      });
      setVoters(response.data);
    } catch (error) {
      console.error('Error fetching voters:', error);
      Alert.alert('Error', 'Failed to load voters');
    }
  };

  useEffect(() => {
    if (selectedCast) {
      fetchVotersByCaste(selectedCast);
    }
  }, [selectedCast]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const openColorLegendModal = (voterId = null) => {
    setSelectedVoterId(voterId);
    setColorLegendModalVisible(true);
  };

  const closeColorLegendModal = () => {
    setSelectedVoterId(null);
    setColorLegendModalVisible(false);
  };

  const handleColorSelection = async (selectedColor) => {
    if (!selectedVoterId) return;

    let voterFavourId;
    let backgroundColor;

    if (selectedColor === '#FF3030') { // Non-Favourable
      voterFavourId = 2;
      backgroundColor = '#FFE4E4'; // Faint red
    } else if (selectedColor === '#FBBE17') { // Doubted
      voterFavourId = 3;
      backgroundColor = '#FFF5D7'; // Faint yellow
    } else if (selectedColor === '#188357') { // Favourable
      voterFavourId = 1;
      backgroundColor = '#E4F8E4'; // Faint green
    }

    try {
      await axios.put(`http://192.168.200.23:8000/api/favour/${selectedVoterId}/`, {
        voter_id: selectedVoterId,
        voter_favour_id: voterFavourId
      });

      setVoters((prevVoters) =>
        prevVoters.map((voter) =>
          voter.voter_id === selectedVoterId ? { ...voter, color: backgroundColor } : voter
        )
      );

      Alert.alert('Success', 'Color updated successfully.');
    } catch (error) {
      console.error('API Error:', error);
    }

    closeColorLegendModal();
  };

  const renderVoterItem = ({ item }) => (
    <View style={[styles.voterItem, { backgroundColor: item.color || '#FFFFFF' }]}>
      <Text style={styles.voterText}>{item.voter_id} - {item.voter_name}</Text>
      <TouchableOpacity style={styles.closeCircle} onPress={() => openColorLegendModal(item.voter_id)}>
        <View style={styles.circle}></View>
      </TouchableOpacity>
    </View>
  );

  const Header = () => (
    <View style={styles.headerContain}>
      <TouchableOpacity style={styles.colorSquare} onPress={() => openColorLegendModal()}>
        <Icon name="circle" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.nav}>
        <Pressable onPress={handleGoBack}>
          <Icon name='chevron-left' size={20} color={'black'} />
        </Pressable>

        <Text style={styles.text}>Cast List</Text>

        <TouchableOpacity style={styles.closeCircle} >
          {/* <View style={styles.circle}></View> */}
        </TouchableOpacity>
      </View>

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

      {selectedCast && (
        <View style={styles.selectedCastContainer}>
          <Text style={styles.selectedCastText}>Caste: {selectedCast}</Text>
          <FlatList
            data={voters}
            keyExtractor={(item) => item.voter_id.toString()}
            renderItem={renderVoterItem}
            contentContainerStyle={styles.voterList}
          />
        </View>
      )}

      <Modal
        visible={colorLegendModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeColorLegendModal}
      >
        <View style={styles.overlay}>
          <View style={styles.colorLegendModalContainer}>
            {[
              { color: '#188357', label: 'Favourable' },
              { color: '#FF3030', label: 'Non-Favourable' },
              { color: '#FBBE17', label: 'Doubted' },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.legendItem} onPress={() => handleColorSelection(item.color)}>
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
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5%',
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
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  selectedCastContainer: {
    flex: 1,

  },
  selectedCastText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#3C4CAC',
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
    fontSize: 16,
  },
  headerContain: {
    flexDirection: 'row',
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
    marginBottom: 10,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
  },
});
