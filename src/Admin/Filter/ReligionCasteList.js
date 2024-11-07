import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Platform, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';

export default function ReligionCasteList() {
  const [townOpen, setTownOpen] = useState(false);
  const [townValue, setTownValue] = useState(null);
  const [townItems, setTownItems] = useState([]);

  const [boothOpen, setBoothOpen] = useState(false);
  const [boothValue, setBoothValue] = useState(null);
  const [boothItems, setBoothItems] = useState([]);

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
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchTowns = async () => {
    try {
      const response = await axios.get('http://192.168.1.31:8000/api/towns/');
      const townsData = response.data.map(town => ({
        label: `${town.town_id} - ${town.town_name}`,
        value: town.town_id,
      }));
      setTownItems(townsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load towns');
    }
  };

  const fetchBoothsByTown = async (townId) => {
    try {
      const response = await axios.get(`http://192.168.1.31:8000/api/booths_by_town/${townId}`);
      const boothsData = response.data.map(booth => ({
        label: `${booth.booth_id} - ${booth.booth_name}`,
        value: booth.booth_id,
      }));
      setBoothItems(boothsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load booths');
    }
  };

  const fetchCasteData = async (religionId) => {
    try {
      const response = await axios.get(`http://192.168.1.31:8000/api/cast_by_religion/${religionId}`);
      const casteData = response.data.map(cast => ({
        label: `${cast.cast_id} - ${cast.cast_name}`,
        value: cast.cast_id,
      }));
      setCasteItems(casteData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load caste data');
    }
  };

  const fetchVotersByBoothAndCaste = async (boothId, castId) => {
    try {
      const response = await axios.get(`http://192.168.1.31:8000/api/booth/${boothId}/cast/${castId}/`);
      setVoters(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load voters');
    }
  };

  const handlePDFClick = async () => {
    if (!townValue || !boothValue || !religionValue || !casteValue) {
      Alert.alert('Error', 'Please select all fields');
      return;
    }

    setPdfLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.31:8000/api/booth_pdf/${boothValue}/cast/${casteValue}/`, {
        responseType: 'arraybuffer',
      });

      const base64 = btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const fileUri = FileSystem.documentDirectory + 'town_users_report.pdf';
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      //Alert.alert('Success', 'PDF has been saved to your device!');

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Error', 'Sharing not available on this device.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download the PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    fetchTowns();
  }, []);

  useEffect(() => {
    if (townValue) {
      fetchBoothsByTown(townValue);
      setBoothOpen(false);
    }
  }, [townValue]);

  useEffect(() => {
    if (religionValue) {
      fetchCasteData(religionValue);
      setCasteOpen(false);
    }
  }, [religionValue]);

  useEffect(() => {
    if (boothValue && casteValue) {
      fetchVotersByBoothAndCaste(boothValue, casteValue);
    }
  }, [boothValue, casteValue]);



  const renderVoterItem = ({ item }) => (
    <View style={styles.voterItem}>
      <Text style={styles.voterText}>{item.voter_id} - {toTitleCase(item.voter_name)}</Text>
      <Text style={styles.voterContact}>Contact: {item.voter_contact_number || "N/A"}</Text>
    </View>
  );

  return (
    <HeaderFooterLayout
      showFooter={false}
      headerText='Cast Wise Voters'
      rightIconName="file-pdf"
      onRightIconPress={handlePDFClick}
    >
      <View style={styles.container}>
        <View style={[styles.pickerWrapper, { zIndex: 4000, elevation: 4000 }]}>
          <DropDownPicker
            open={townOpen}
            value={townValue}
            items={townItems}
            setOpen={setTownOpen}
            setValue={setTownValue}
            setItems={setTownItems}
            placeholder="Select Town"
            searchable={true}
            searchPlaceholder="Search town..."
            containerStyle={styles.picker}
          />
        </View>

        {townValue && (
          <View style={[styles.pickerWrapper, { zIndex: 3000, elevation: 3000 }]}>
            <DropDownPicker
              open={boothOpen}
              value={boothValue}
              items={boothItems}
              setOpen={setBoothOpen}
              setValue={setBoothValue}
              setItems={setBoothItems}
              placeholder="Select Booth"
              searchable={true}
              searchPlaceholder="Search booth..."
              containerStyle={styles.picker}
            />
          </View>
        )}

        {boothValue && (
          <View style={[styles.pickerWrapper, { zIndex: 2000, elevation: 2000 }]}>
            <DropDownPicker
              open={religionOpen}
              value={religionValue}
              items={religionItems}
              setOpen={setReligionOpen}
              setValue={setReligionValue}
              setItems={setReligionItems}
              placeholder="Select Religion"
              searchable={true}
              searchPlaceholder="Search religion..."
              containerStyle={styles.picker}
            />
          </View>
        )}

        {religionValue && (
          <View style={[styles.pickerWrapper, { zIndex: 1000, elevation: 1000 }]}>
            <DropDownPicker
              open={casteOpen}
              value={casteValue}
              items={casteItems}
              setOpen={setCasteOpen}
              setValue={setCasteValue}
              setItems={setCasteItems}
              placeholder="Select Caste"
              searchable={true}
              searchPlaceholder="Search caste..."
              containerStyle={styles.picker}
            />
          </View>
        )}

        {casteValue && boothValue && (
          <>
            <Text style={{ color: '#0033cc', fontSize: 20, fontWeight: '500', textAlign: 'center' }}>Cast Wise Voters</Text>
            <FlatList
              data={voters}
              keyExtractor={(item) => item.voter_id.toString()}
              renderItem={renderVoterItem}
              ListEmptyComponent={() => <Text style={{
                textAlign: 'center', color: 'gray', alignSelf: 'center', fontSize: 18,
                justifyContent: 'center', alignItems: 'center', marginTop: 50
              }}>Voters Not Found</Text>}
            />
          </>
        )}
      </View>
    </HeaderFooterLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  pickerWrapper: {
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  voterItem: {
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    width: "100%",
    borderRadius: 5,
    alignContent: 'center',
    textAlignVertical: 'center'
  },
  voterText: {
    fontSize: 16,
    flex: 1
  },
  voterContact: {
    color: 'red',
    flex: 1

  },
});
