import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import withSidebar from './Withsidebar';

const { width, height } = Dimensions.get('window');

function Logout({ navigation, toggleSidebar }) {
  return (
    <LinearGradient
      colors={['#FF9933', '#FFFFFF', '#138808']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
          <Ionicons name="menu" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Logout</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.boxText}>Log out of your account?</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Entry')}>
          <Text style={styles.buttonTextt}>Log out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // width,
    // height,
  },
  header: {
    // marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: 'black',
    width: '100%',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  headerr: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: 'black',
    width: '100%',
    marginBottom: '70%',
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
  box: {
    width: width * 0.8,
    padding: 20,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: '50%',
    marginLeft: '10%'
  },
  boxText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    width: '50%',
    padding: 15,
    backgroundColor: '#d9deff',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,

  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonTextt: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default withSidebar(Logout)