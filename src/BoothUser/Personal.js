import { Alert, Dimensions, Image, View, StyleSheet, Text, TextInput } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import HeaderFooterLayout from './HeaderFooterLayout';

const { width, height } = Dimensions.get('screen');

const AccountSettings = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNotificationBtn = () => {
    Alert.alert('Notification Button Pressed');
  };

  const CustomeTextInput = (props) => {
    return (
      <TextInput
        value={props.label + props.valueDetails}
        style={props.styles}
        readOnly={props.readValue}
      />
    );
  };

  return (
    <>
      <View style={{ height: height * 0.25 }}>
        <LinearGradient
          colors={['#3C4CAC', '#F04393']}
          locations={[0.2, 1]}
          style={styles.gradient}
        >
          <View style={styles.nav}>
            <Pressable onPress={handleGoBack}>
              <Octicons name="chevron-left" size={26} color={'white'} />
            </Pressable>

            <Text style={[styles.text, { color: 'white' }]}>{'Profile'}</Text>

            <Pressable onPress={handleNotificationBtn}>
              <AntDesign name="bells" size={24} color={'white'} />
            </Pressable>
          </View>
        </LinearGradient>
      </View>

      <View style={{ height: height * 0.48 }}>
        <View style={styles.profileDetailsView}>
          <View style={styles.profileImageView}>
            <View style={styles.profileImageCircle}>
              <Image source={require('../../assets/Cover.png')} style={styles.profileImage} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Account User</Text>
            <Text>User</Text>
          </View>

          <View style={{ marginVertical: 10 }}>
            <CustomeTextInput
              label={'Username: '}
              valueDetails={'User'}
              styles={styles.profileTextInput}
              readValue={true}
            />
            <CustomeTextInput
              label={'User ID: '}
              valueDetails={'62'}
              styles={styles.profileTextInput}
              readValue={true}
            />

            <CustomeTextInput
              label={'Phone: '}
              valueDetails={'9876543210'}
              styles={styles.profileTextInput}
              readValue={true}
            />


            <CustomeTextInput
              label={'Town: '}
              valueDetails={'Dhilli'}
              styles={styles.profileTextInput}
              readValue={true}
            />
          </View>
        </View>
      </View>

      <View style={{ height: height * 0.1 }}>
        <Pressable style={styles.updateButton} onPress={() => { navigation.navigate('LogOut') }}>
          <Text style={styles.updateButtonTxt}>Logout</Text>
        </Pressable>
      </View>
    </>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gradient: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20,
    marginHorizontal: -20,
    marginVertical: -50,
  },
  profileDetailsView: {
    height: height * 0.55,
    width: '90%',
    elevation: 2,
    borderRadius: 10,
    marginTop: '-25%',
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
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: width,
    borderColor: '#3C4CAC',
    marginTop: -70,
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
    marginVertical: 8,
    backgroundColor: 'rgba(236, 238, 247, 1)',
    fontSize: 18,
  },
  updateButton: {
    width: width * 0.8,
    height: height * 0.06,
    backgroundColor: '#F04393',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  updateButtonTxt: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});
