import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { launchImageLibrary } from 'react-native-image-picker';
import { BoothUserContext } from './ContextApi/BuserContext';
import withSidebar from './Withsidebar';

function Settings({ navigation, toggleSidebar }) {
  const { userName } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(null);

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('You cancelled image selection.');
      } else if (response.error) {
        Alert.alert('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setProfileImage(source);
      }
    });
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
          <Ionicons name="menu" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={selectImage}>
            {profileImage ? (
              <Image source={profileImage} style={styles.profileImage} />
            ) : (
              <Image source={require('../assets/profile.png')} style={styles.profileImage} />
            )}
          </TouchableOpacity>
          <Text style={styles.profileName}>{userName}</Text>
        </View>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="person-outline" size={24} style={styles.icon} />
          <Text style={styles.settingText}>Username</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Changepass')}>
          <Ionicons name="lock-closed-outline" size={24} style={styles.icon} />
          <Text style={styles.settingText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Personal')}>
          <Ionicons name="document-text-outline" size={24} style={styles.icon} />
          <Text style={styles.settingText}>Personal Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('About')}>
          <Ionicons name="information-circle-outline" size={24} style={styles.icon} />
          <Text style={styles.settingText}>About us</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: 'black',
    width: '100%',
    // marginBottom:'70%',
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
  //   headerText: {
  //     fontSize: 24,
  //     color: '#fff',
  //     fontWeight: 'bold',
  //     marginBottom: 30,
  //   },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    backgroundColor: '#e3e3fc',
    borderRadius: 10,
    marginBottom: 15,

  },
  icon: {
    marginRight: 15,
    color: 'black'
  },
  settingText: {
    fontSize: 18,
    color: 'black',
  },
});
export default withSidebar(Settings);


