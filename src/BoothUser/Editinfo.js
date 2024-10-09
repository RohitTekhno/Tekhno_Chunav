import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const Editinfo = ({ route, navigation }) => {
  const { voter_id, voter_name, voter_caste, voter_contact } = route.params.voter;

  const [updatedName, setUpdatedName] = useState(voter_name);
  const [updatedCaste, setUpdatedCaste] = useState(voter_caste);
  const [updatedContactNumber, setUpdatedContactNumber] = useState(voter_contact);

  const updateVoterInfo = async () => {
    try {
      const apiUrl = `http://192.168.200.23:8000/api/voters/${voter_id}/`;
      const response = await axios.patch(apiUrl, {
        voter_name: updatedName,
        voter_caste: updatedCaste,
        voter_contact: updatedContactNumber,
      });

      if (response.status !== 200) {
        throw new Error('Failed to update voter information.');
      }

      alert('Voter information updated successfully!');
      navigation.goBack(); // Navigate back to the previous screen after successful update
    } catch (error) {
      console.error('Error updating voter information:', error.message);
      alert('Failed to update voter information. Please try again.');
    }
  };

  useEffect(() => {
    setUpdatedName(voter_name);
    setUpdatedCaste(voter_caste);
    setUpdatedContactNumber(voter_contact);
  }, [voter_name, voter_caste, voter_contact]);

  return (
    <LinearGradient
      colors={['#FF9933', '#FFFFFF', '#138808']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Voter Information</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Voter ID:</Text>
        <Text style={styles.infoText}>{voter_id}</Text>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.inputField}
          value={updatedName}
          onChangeText={setUpdatedName}
          placeholder="Enter Name"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Contact Number:</Text>
        <TextInput
          style={styles.inputField}
          value={updatedContactNumber}
          onChangeText={setUpdatedContactNumber}
          keyboardType="phone-pad"
          placeholder="Enter Contact Number"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.updateButton} onPress={updateVoterInfo}>
          <Text style={styles.buttonText}>Update Information</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
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
  formContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    elevation: 8,
    alignSelf: 'center',
    marginTop: 30,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
  },
  infoText: {
    fontSize: 22,
    marginBottom: 10,
    color: '#34363b',
  },
  inputField: {
    height: 40,
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
  },
  updateButton: {
    backgroundColor: '#4f5b73',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Editinfo;
