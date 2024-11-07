import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert, Dimensions, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LanguageContext } from '../ContextApi/LanguageContext';
import axios from 'axios';
import { WardUserContext } from '../ContextApi/WardUserContext';

const { width, height } = Dimensions.get('window');

const WardProfile = () => {
  const { language } = useContext(LanguageContext);
  const { wardUserId } = useContext(WardUserContext);
  const navigation = useNavigation();

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNotificationBtn = () => {
    Alert.alert("Notification Pressed...");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!wardUserId) {
        Alert.alert("User ID is not defined");
        return;
      }

      try {
        const response = await axios.get(`http://192.168.1.31:8000/api/prabhag_users_info/${wardUserId}`);
        console.log(response.data);  // Log the response data to check if it contains what you expect
        if (Array.isArray(response.data) && response.data.length > 0) {
          setUserInfo(response.data[0]);  // Use the first object in the array
        } else {
          Alert.alert("No user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [wardUserId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No user information available</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style='light' />
      <View style={{ height: height * 0.3 }}>

        <LinearGradient
          colors={['#3C4CAC', '#F04393']}
          locations={[0.2, 1]}
          style={styles.gradient}
        >
          <View style={styles.nav}>
            <Pressable onPress={handleGoBack}>
              <MaterialIcons name="keyboard-backspace" size={28} color="white" />
            </Pressable>
            <Text style={styles.text}>
              {language === 'en' ? 'Profile' : 'प्रोफाइल'}
            </Text>
            <Pressable onPress={handleNotificationBtn}>
              <AntDesign name="bells" size={width * 0.06} color="white" />
            </Pressable>
          </View>
        </LinearGradient>
      </View>

      <View style={{ height: height * 0.5, paddingHorizontal: height * 0.025 }}>
        <View style={styles.profileDetailsView}>
          <View style={styles.profileImageView}>
            <View style={styles.profileImageCircle}>
              <Image source={require('../../assets/Votee.png')} style={styles.profileImage} />
            </View>
            <Text style={styles.profileNameText}>
              {language === 'en' ? 'Ward User' : 'प्रभाग वापरकर्ता'}
            </Text>
          </View>

          <View style={styles.detailsContainer}>
            <TextInput
              style={styles.profileTextInput}
              value={language === 'en' ? `User Name: ${userInfo.prabhag_user_name || ''}` : `वापरकर्ता नाव: ${userInfo.town_user_name || ''}`}
              editable={false}
            />
            <TextInput
              style={styles.profileTextInput}
              value={language === 'en' ? `User Id: ${userInfo.prabhag_user_id || ''}` : `वापरकर्ता आयडी: ${userInfo.town_user_id || ''}`}
              editable={false}
            />
            <TextInput
              style={styles.profileTextInput}
              value={language === 'en' ? `Contact No.: ${userInfo.prabhag_user_contact_number || ''}` : `संपर्क क्रमांक: ${userInfo.town_user_contact_number || ''}`}
              editable={false}
            />
            <TextInput
              style={styles.profileTextInput}
              value={language === 'en' ? `Ward: ${userInfo.prabhag_name || ''}` : `प्रभाग: ${userInfo.town_names || ''}`}
              editable={false}
            />
          </View>

        </View>

        <Pressable style={styles.logOutButton} onPress={() => { navigation.navigate('LogOut') }}>
          <Text style={styles.logOutButtonTxt}>
            {language === 'en' ? 'Log Out' : 'लॉग आउट'}
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20,
    paddingTop: 45,
  },

  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  text: {
    color: 'white',
    fontSize: height * 0.03,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  profileDetailsView: {
    height: height * 0.55,
    width: "99%",
    elevation: 2,
    borderRadius: 10,
    marginTop: '-17%',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  profileImageView: {
    width: '100%',
    borderBottomWidth: 1,
    borderBlockColor: 'black',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
  },
  profileImageCircle: {
    width: width * 0.3,
    height: width * 0.3,
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: width,
    borderColor: '#3C4CAC',
    marginTop: -height * 0.1,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  profileTextInput: {
    width: width * 0.8,
    height: height * 0.06,
    borderRadius: 8,
    paddingStart: 20,
    marginVertical: height * 0.017,
    backgroundColor: 'rgba(236, 238, 247, 1)',
    fontSize: 18,
  },
  logOutButton: {
    width: width * 0.8,
    height: height * 0.065,
    backgroundColor: '#F04393',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 25,
    borderRadius: 7,
    // padding: 10
  },
  logOutButtonTxt: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  }
});

export default WardProfile;
