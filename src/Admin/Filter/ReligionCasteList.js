import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';

export default function ReligionCasteList() {
  const [religionOpen, setReligionOpen] = useState(false);
  const [religionValue, setReligionValue] = useState(null);
  const [religionItems, setReligionItems] = useState([
    { label: '1 - Hindu', value: 1 },
    { label: '2 - Muslim', value: 2 },
    { label: '3 - Christian', value: 3 },
  ]);

  const [casteOpen, setCasteOpen] = useState(false);
  const [casteValue, setCasteValue] = useState(null);
  const [casteItems, setCasteItems] = useState([]);

  const [voters, setVoters] = useState([]);

  // Fetch castes dynamically based on selected religion
  const fetchCasteData = async (religionId) => {
    try {
      const response = await axios.get(`http://192.168.200.23:8000/api/cast_by_religion/${religionId}`);
      const casteData = response.data.map(cast => ({
        label: `${cast.cast_id} - ${cast.cast_name}`,
        value: cast.cast_id,
      }));
      setCasteItems(casteData);
    } catch (error) {
      console.error('Error fetching caste data:', error);
      Alert.alert('Error', 'Failed to load caste data');
    }
  };

  // Fetch voters by selected caste from the new API
  const fetchVotersByCaste = async (castId) => {
    try {
      const response = await axios.get(`http://192.168.200.23:8000/api/cast_wise_voter_list/${castId}`);
      setVoters(response.data);
    } catch (error) {
      console.error('Error fetching voters:', error);
      Alert.alert('Error', 'Failed to load voters');
    }
  };

  useEffect(() => {
    if (religionValue) {
      // Fetch caste data when a religion is selected
      fetchCasteData(religionValue);
      setCasteOpen(false); // Close caste dropdown until religion is selected
    }
  }, [religionValue]);

  useEffect(() => {
    if (casteValue) {
      // Fetch voters when a caste is selected
      fetchVotersByCaste(casteValue);
    }
  }, [casteValue]);

  const renderVoterItem = ({ item }) => (
    <View style={styles.voterItem}>
      <Text style={styles.voterText}>{item.voter_id} - {item.voter_name}</Text>
    </View>
  );

  return (
    <HeaderFooterLayout
    showFooter={false}
    headerText='Cast Wise Voters'
    >
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Select Religion and Caste</Text> */}

      {/* Religion Dropdown */}
      <DropDownPicker
        open={religionOpen}
        value={religionValue}
        items={religionItems}
        setOpen={setReligionOpen}
        setValue={setReligionValue}
        setItems={setReligionItems}
        placeholder="Select Religion"
        containerStyle={styles.picker}
        zIndex={6000}
      />

      {/* Caste Dropdown (Only opens after religion is selected) */}
      {religionValue && (
        <DropDownPicker
          open={casteOpen}
          value={casteValue}
          items={casteItems}
          setOpen={setCasteOpen}
          setValue={setCasteValue}
          setItems={setCasteItems}
          placeholder="Select Caste"
          containerStyle={styles.picker}
          zIndex={2000}
        />
      )}

      {/* Voter List (Display voters based on caste selection) */}
      {casteValue && (
        <FlatList
          data={voters}
          keyExtractor={(item) => item.voter_id.toString()}
          renderItem={renderVoterItem}
          contentContainerStyle={styles.voterList}
        />
      )}
    </View>
    </HeaderFooterLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    flex: 1,
    // backgroundColor: '#F5F5F5',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#3C4CAC',
  },
  picker: {
    height: 50,
    marginBottom: 20,
    zIndex: 10, // Ensure the dropdown overlaps content below
  },
  voterList: {
    paddingTop: 20,
  },
  voterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  voterText: {
    fontSize: 16,
    color: '#333',
  },
});
