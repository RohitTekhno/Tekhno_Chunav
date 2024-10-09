import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { BoothUserContext } from './ContextApi/BuserContext';

const { width } = Dimensions.get('window');

export default function Sidebar({ navigation, onClose }) {
  const { userName } = useContext(BoothUserContext);

  const handleNavigation = (route) => {
    navigation.navigate(route);
    onClose();
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <BlurView style={StyleSheet.absoluteFill} intensity={80} />
        <TouchableWithoutFeedback onPress={() => { }}>
          <LinearGradient
            colors={['#3C4CAC', '#F04393']}
            locations={[0.6, 1]}
            style={styles.gradient}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Icon name='chevron-left' size={25} color={'white'} />
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Image
                source={require('../../assets/tekhnoWhite.png')}
                style={styles.image}
              />
            </View>

            <View style={styles.navContainer}>
              <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('About')}>
                <MaterialIcons name="dashboard" size={24} color="white" />
                <Text style={styles.navText}>About Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Help')}>
                <MaterialIcons name="person" size={24} color="white" />
                <Text style={styles.navText}>Help</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('')}>
                <Ionicons name="settings-outline" size={24} color="white" />
                <Text style={styles.navText}>Contact Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Personal')}>
                <Feather name="log-out" size={24} color="white" />
                <Text style={styles.navText}>Settings</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.logOutView} >
              <Feather name="log-out" size={24} color="#3C4CAC" onPress={() => handleNavigation('Entry')} />
              <Text style={{ color: '#3C4CAC', fontSize: 18 }} onPress={() => handleNavigation('Entry')}>Log Out</Text>
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 999,
  },
  gradient: {
    flex: 1,
    width: width * 0.6,
    height: '100%',
    padding: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
    borderBottomWidth: 2,
    borderColor: 'white',
  },
  image: {
    width: 100,
    height: 100,
  },
  welcomeText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 17,
    textAlign: 'center',
  },
  navContainer: {
    marginTop: 30,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  navText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 10,
  },
  logOutView: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    columnGap: 15
  },
});
