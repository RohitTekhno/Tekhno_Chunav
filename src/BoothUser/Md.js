

import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import withSidebar from './Withsidebar';
import { BoothUserContext } from './ContextApi/BuserContext';

const { width, height } = Dimensions.get('window');

const scale = (size) => (width / 375) * size;

function Md({ navigation, toggleSidebar }) {
  const { buserId } = useContext(BoothUserContext);

  const [voterId, setVoterId] = useState([]);
  const [voterNames, setVoterNames] = useState([]);

  const fetchVoterData = async () => {
    try {
      const url = `http://192.168.200.23:8000/api/get_voters_by_user_wise/${buserId}/`;
      const response = await axios.get(url);
      if (response.data && response.data.voters) {
        const data = response.data.voters;
        const id = data.map(voter => voter.voter_id);
        const names = data.map(voter => voter.voter_name);
        const contactNumbers = data.map(voter => voter.voter_contact_number);
        const casts = data.map(voter => voter.voter_cast);
        const parentNames = data.map(voter => voter.voter_parent_name);
        const ages = data.map(voter => voter.voter_age);
        const genders = data.map(voter => voter.voter_gender);
        const favour = data.map(voter => voter.voter_favour_id);
        const town = data.map(voter => voter.town_name);
        const booth = data.map(voter => voter.booth_name)
        const status = data.map(voter => voter.voter_live_status_id)
        setVoterId(id);
        setVoterNames(names);
        navigation.navigate('Voterlist', {
          buserId,
          voterId: id,
          voterNames: names,
          voterContactNumbers: contactNumbers,
          voterCasts: casts,
          voterParentNames: parentNames,
          voterAges: ages,
          voterGenders: genders,
          voterfavour: favour,
          voterTown: town,
          voterBooth: booth,
          voterStatus: status,
        });
      } else {
        Alert.alert('Error', 'Unexpected data format.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to fetch voter names: ${error.message}`);
    }
  };

  return (
    <LinearGradient
      colors={['#FF9933', '#FFFFFF', '#138808']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
          <Ionicons name="menu" size={scale(32)} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Elections</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.cardRow}>
          <TouchableOpacity style={styles.card} onPress={fetchVoterData}>
            <Image source={require('../assets/cc.png')} style={styles.cardImage} />
            <Text style={styles.cardText}>Assembly Elections</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Image source={require('../assets/cc.png')} style={styles.cardImage} />
            <Text style={styles.cardText}>Zilla Parishad</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardRow}>
          <TouchableOpacity style={styles.card}>
            <Image source={require('../assets/cc.png')} style={styles.cardImage} />
            <Text style={styles.cardText}>Panchayat Samiti</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Image source={require('../assets/cc.png')} style={styles.cardImage} />
            <Text style={styles.cardText}>Gram Panchayat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(20),
    paddingBottom: scale(20),
    backgroundColor: 'black',
    width: '100%',
  },
  menuButton: {
    position: 'absolute',
    left: scale(20),
  },
  headerText: {
    color: '#fff',
    fontSize: scale(24),
    fontWeight: 'bold',
  },
  cardContainer: {
    marginTop: scale(10),
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(20),
  },
  card: {
    width: (width - 70) / 2,
    padding: scale(5),
    backgroundColor: '#e6e8fa',
    borderRadius: scale(10),
    alignItems: 'center',
    elevation: 10,
    margin: scale(10),
  },
  cardImage: {
    width: '80%',
    height: scale(100),
    borderRadius: scale(10),
    marginBottom: scale(10),
  },
  cardText: {
    fontSize: scale(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default withSidebar(Md);
