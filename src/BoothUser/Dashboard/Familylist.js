import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated, Easing, Modal, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import { BoothUserContext } from '../../ContextApi/BuserContext';


export default function Familylist({ navigation }) {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { buserId } = useContext(BoothUserContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [arrowAnimations, setArrowAnimations] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [removalLoading, setRemovalLoading] = useState(false);

  useEffect(() => {
    const fetchFamilyGroups = async () => {
      try {
        const response = await axios.get(`http://192.168.1.8:8000/api/get_family_groups_by_user/${buserId}/`);
        if (response.status === 200) {
          const familyGroups = await Promise.all(response.data.map(async (group) => {

            const membersResponse = await axios.get(`http://192.168.1.8:8000/api/get_voters_by_group_id/${group.family_group_id}/`);
            const membersCount = membersResponse.status === 200 ? membersResponse.data.voters.length : 0;
            return {
              ...group,
              member_count: membersCount,
            };
          }));
          setData(familyGroups);
          initializeArrowAnimations(familyGroups);
        } else {
          setError('Data not found');
        }
      } catch (error) {
        console.error('Error fetching family group data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    const initializeArrowAnimations = (groups) => {
      const animations = {};
      groups.forEach((group) => {
        animations[group.family_group_id] = new Animated.Value(0);
      });
      setArrowAnimations(animations);
    };

    if (buserId) {
      fetchFamilyGroups();
    } else {
      setError('Invalid user ID');
      setLoading(false);
    }
  }, [buserId]);

  const handlePress = async (id) => {
    setSelectedId(selectedId === id ? null : id);

    Animated.timing(arrowAnimations[id], {
      toValue: selectedId === id ? 0 : 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    if (selectedId !== id) {
      setModalLoading(true);
      setModalVisible(true);
      try {
        const response = await axios.get(`http://192.168.1.8:8000/api/get_voters_by_group_id/${id}/`);
        if (response.status === 200) {
          setMembers(response.data.voters);
        }
      } catch (error) {
        console.error('Error fetching voters:', error);
      } finally {
        setModalLoading(false);
      }
    }
  };


  const handleVoterSelect = (voter) => {
    setSelectedVoter(voter);
    setConfirmModalVisible(true);
  };

  const handleRemoveVoter = async () => {
    setRemovalLoading(true);
    try {

      console.log('Removing voter with ID:', selectedVoter.voter_id);

      const response = await axios.patch(`http://192.168.1.8:8000/api/remove_voter_from_family_group/${selectedVoter.voter_id}/`, {
        voter_id: selectedVoter.voter_id,
      });

      console.log('API response:', response);

      if (response.status === 200) {
        Alert.alert('Success', 'Voter removed from the group successfully');

        setMembers(members.filter((member) => member.voter_id !== selectedVoter.voter_id));
      } else {
        console.error('Unexpected response:', response);
        Alert.alert('Error', 'Unexpected response from the server');
      }
    } catch (error) {
      console.error('Error removing voter:', error);
      Alert.alert('Error', `Failed to remove voter from the group: ${error.message}`);
    } finally {
      setRemovalLoading(false);
      setConfirmModalVisible(false);
    }
  };

  const rotateArrow = (id) =>
    arrowAnimations[id]?.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg'],
    }) || '0deg';

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.family_group_id)}>
      <View style={styles.leftSection}>
        <View style={styles.row}>
          <Text style={styles.idText}>
            {language === 'en' ? 'ID' : 'क्र.'} : {item.family_group_id}</Text>
          <Text style={styles.memberCountText}>
            {language === 'en' ? 'Members' : 'सदस्य'} : {item.member_count}</Text>
        </View>
        <Text style={styles.nameText}>
          {language === 'en' ? 'Name' : 'नाव'} : {item.family_group_name}</Text>
        <Text style={styles.contactText}>
          {language === 'en' ? 'Contact' : 'संपर्क'} : {item.family_group_contact_no}</Text>
      </View>
      <Animated.View style={{ transform: [{ rotate: rotateArrow(item.family_group_id) }] }}>
        <MaterialIcons name="arrow-forward-ios" size={24} color="#000" style={styles.arrowIcon} />
      </Animated.View>
    </TouchableOpacity>
  );

  const renderModalContent = () => {
    if (modalLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (members.length === 0) {
      return <Text>
        {language === 'en' ? 'No members found for this group.' : 'या गटात कोणतेही सदस्य नाहीत.'}
      </Text>;
    }

    return (
      <FlatList
        data={members}
        keyExtractor={(item) => item.voter_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.memberItem} onPress={() => handleVoterSelect(item)}>
            <Text style={styles.memberText}>
              {language === 'en' ? 'ID' : 'क्र.'}: {item.voter_id}</Text>
            <Text style={styles.memberText}>
              {language === 'en' ? 'Name' : 'नाव'}: {item.voter_name}</Text>
            <Text style={styles.memberText}>
              {language === 'en' ? 'Contact:' : 'संपर्क:'} {item.voter_contact_number || 'N/A'}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <HeaderFooterLayout
      headerText={language === 'en' ? "Family" : 'कुटुंब'}
      leftIcon={<MaterialIcons name="keyboard-backspace" size={28} color="black" onPress={handleGoBack} />}
      showFooter={false}>
      <View style={styles.container}>
        {loading ? (
          <Text>
            {language === 'en' ? 'Loading...' : 'लोड करत आहे...'}
          </Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.family_group_id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text>
              {language === 'en' ? 'No family groups available' : 'कोणतेही कुटुंब उपलब्ध नाहीत'}
            </Text>}
          />
        )}

        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {language === 'en' ? 'Group Members' : 'कुटुंबातील सदस्य'}
                </Text>
                <Text style={styles.modalMemberCount}>
                  {language === 'en' ? 'Members:' : 'सदस्य:'} {members.length}</Text>
              </View>

              {renderModalContent()}

              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>
                  {language === 'en' ? 'Close' : 'बंद करा'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={confirmModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {language === 'en' ? 'Remove Voter' : 'मतदार काढा '}
              </Text>
              <Text>
                {language === 'en' ? 'Are you sure you want to remove ' : 'तुम्हाला खात्री आहे की तुम्ही काढू इच्छिता'} {selectedVoter?.voter_name} ?</Text>
              <View style={styles.confirmButtonContainer}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleRemoveVoter} // Assuming you have a function to handle the removal action
                  disabled={removalLoading}
                >
                  <Text style={styles.confirmButtonText}>
                    {removalLoading
                      ? (language === 'en' ? 'Removing...' : 'काढत आहे...')
                      : (language === 'en' ? 'Remove' : 'काढा')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setConfirmModalVisible(false)}
                  disabled={removalLoading}
                >
                  <Text style={styles.cancelButtonText}>
                    {language === 'en' ? 'Cancel' : 'रद्द करा'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </HeaderFooterLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,

  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginVertical: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  idText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  nameText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 5,
  },
  contactText: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  memberCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  arrowIcon: {
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    height: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalMemberCount: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  memberItem: {
    marginVertical: 10,
  },
  memberText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  confirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
